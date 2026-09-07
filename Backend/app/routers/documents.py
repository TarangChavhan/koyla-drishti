import os
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.postgres import get_db
from app.db.mongo import mongo_db
from app.models.document import MineDocument
from app.models.mine import Mine
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.middleware.auth import require_authenticated_user, verify_mine_access
from app.services.ocr_service import process_statutory_document
from app.services.audit_service import record_audit_log
from app.utils.helpers import (
    generate_id,
    sanitize_filename,
    is_allowed_file,
    format_current_timestamp,
    standard_response
)

router = APIRouter(prefix="/documents", tags=["Document & Evidence Management"])

def serialize_document(doc: MineDocument) -> dict:
    return {
        "id": doc.id,
        "mineId": doc.mine_id,
        "mineName": doc.mine_name,
        "title": doc.title,
        "category": doc.category,
        "fileName": doc.file_name,
        "fileSize": doc.file_size,
        "fileType": doc.file_type,
        "uploadDate": doc.upload_date,
        "expiryDate": doc.expiry_date,
        "status": doc.status,
        "url": doc.url or f"/uploads/{doc.file_name}",
        "ocr_extracted_data": doc.ocr_extracted_data
    }

@router.get("")
async def get_all_documents(
    mine_id: Optional[str] = None,
    category: Optional[str] = None,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """List compliance documents with category and mine filters."""
    query = db.query(MineDocument)

    if current_user.role.upper() in ["MINE_AUTHORITY", "MINE"] and current_user.mine_id:
        query = query.filter(MineDocument.mine_id == current_user.mine_id)
    elif mine_id:
        query = query.filter(MineDocument.mine_id == mine_id)

    if category and category != "All":
        query = query.filter(MineDocument.category.ilike(category))

    docs = query.order_by(MineDocument.created_at.desc()).all()
    results = [serialize_document(d) for d in docs]
    return standard_response(success=True, data=results)

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form("Statutory Mine Clearance"),
    category: str = Form("Compliance"),
    mine_id: Optional[str] = Form(None),
    expiry_date: Optional[str] = Form(None),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """
    Secure file upload for compliance returns, inspection proof, and statutory certificates.
    Saves file to disk, runs OCR parsing, saves metadata to PostgreSQL, and stores raw OCR to MongoDB.
    """
    target_mine_id = mine_id or current_user.mine_id or "KD-104"
    verify_mine_access(current_user, target_mine_id)

    raw_filename = file.filename or "statutory_return.pdf"
    clean_name = sanitize_filename(raw_filename)
    if not is_allowed_file(clean_name):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Disallowed file type. Permitted formats: PDF, JPG, PNG, XLSX, CSV."
        )

    file_bytes = await file.read()
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > settings.MAX_UPLOAD_SIZE_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum upload size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # Save to disk
    doc_id = generate_id("DOC", 3)
    saved_filename = f"{doc_id}_{clean_name}"
    save_path = os.path.join(settings.UPLOAD_DIR, saved_filename)
    with open(save_path, "wb") as f:
        f.write(file_bytes)

    # Format file size string (e.g. '2.4 MB')
    size_str = f"{size_mb:.1f} MB" if size_mb >= 1.0 else f"{int(len(file_bytes)/1024)} KB"
    file_ext = clean_name.rsplit(".", 1)[1].lower()

    # Get Mine Name
    mine = db.query(Mine).filter(Mine.id == target_mine_id).first()
    mine_name = mine.name if mine else f"Mine {target_mine_id}"

    # Run OCR if applicable
    ocr_result = None
    if file_ext in ["pdf", "jpg", "png", "jpeg"]:
        try:
            ocr_res = await process_statutory_document(
                file_bytes=file_bytes,
                filename=clean_name,
                mine_id=target_mine_id,
                db=db,
                user=current_user
            )
            ocr_result = ocr_res.extracted_fields
        except Exception:
            pass

    new_doc = MineDocument(
        id=doc_id,
        mine_id=target_mine_id,
        mine_name=mine_name,
        title=title,
        category=category,
        file_name=saved_filename,
        file_path=save_path,
        file_size=size_str,
        file_type=file_ext,
        upload_date=format_current_timestamp().split(",")[0],
        expiry_date=expiry_date or "31 Dec 2027",
        status="Verified" if (ocr_result and not ocr_result.get("review_required", False)) else "Review",
        url=f"/uploads/{saved_filename}",
        ocr_extracted_data=ocr_result,
        uploaded_by=current_user.id
    )
    db.add(new_doc)

    record_audit_log(
        db=db,
        action="DOCUMENT_UPLOADED",
        entity_type="DOCUMENT",
        entity_id=doc_id,
        user=current_user,
        details={"filename": saved_filename, "size": size_str, "mine_id": target_mine_id}
    )
    db.commit()

    return standard_response(
        success=True,
        message="Document uploaded and processed successfully",
        data=serialize_document(new_doc)
    )

@router.delete("/{doc_id}")
async def delete_document(
    doc_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Remove statutory document filing."""
    doc = db.query(MineDocument).filter(MineDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    verify_mine_access(current_user, doc.mine_id)

    db.delete(doc)
    record_audit_log(
        db=db,
        action="DOCUMENT_DELETED",
        entity_type="DOCUMENT",
        entity_id=doc_id,
        user=current_user
    )
    db.commit()
    return standard_response(success=True, message=f"Document {doc_id} removed")
