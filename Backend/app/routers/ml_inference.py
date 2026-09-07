from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.user import User
from app.middleware.auth import require_authenticated_user, verify_mine_access
from app.services.cv_service import process_ppe_image, process_hazard_image
from app.services.ocr_service import process_statutory_document
from app.utils.helpers import is_allowed_file, sanitize_filename, standard_response

router = APIRouter(prefix="/ai", tags=["Machine Learning Inference"])

@router.post("/ppe/analyze")
async def analyze_ppe_endpoint(
    mine_id: str = Form("KD-104"),
    file: UploadFile = File(...),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """
    Ingest image or CCTV pit snapshot, run PPE Object Detection,
    save detection records to MongoDB, derive risk, and generate alerts if non-compliant.
    """
    verify_mine_access(current_user, mine_id)

    filename = sanitize_filename(file.filename or "cctv_frame.jpg")
    if not is_allowed_file(filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload JPG or PNG image."
        )

    file_bytes = await file.read()
    result = await process_ppe_image(
        mine_id=mine_id,
        image_bytes=file_bytes,
        filename=filename,
        db=db,
        user=current_user
    )

    return standard_response(
        success=True,
        message="PPE detection and compliance evaluation complete",
        data=result.dict()
    )

@router.post("/hazard/analyze")
async def analyze_hazard_endpoint(
    mine_id: str = Form("KD-104"),
    file: UploadFile = File(...),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """
    Run Hazard Detection CV model for fire, smoke, and slope/bench instability.
    Persists inference data to MongoDB and triggers alert if threat detected.
    """
    verify_mine_access(current_user, mine_id)

    filename = sanitize_filename(file.filename or "hazard_frame.jpg")
    if not is_allowed_file(filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload JPG or PNG."
        )

    file_bytes = await file.read()
    result = await process_hazard_image(
        mine_id=mine_id,
        image_bytes=file_bytes,
        filename=filename,
        db=db,
        user=current_user
    )

    return standard_response(
        success=True,
        message="Pit hazard analysis evaluated successfully",
        data=result.dict()
    )

@router.post("/document/analyze")
async def analyze_document_endpoint(
    mine_id: Optional[str] = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """
    Perform Document OCR & structured parsing for statutory mining returns.
    Saves raw tokens to MongoDB and extracts authoritative values with confidence score.
    """
    if mine_id:
        verify_mine_access(current_user, mine_id)

    filename = sanitize_filename(file.filename or "clearance_doc.pdf")
    if not is_allowed_file(filename):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported document format. Allowed: PDF, JPG, PNG."
        )

    file_bytes = await file.read()
    result = await process_statutory_document(
        file_bytes=file_bytes,
        filename=filename,
        mine_id=mine_id,
        db=db,
        user=current_user
    )

    return standard_response(
        success=True,
        message="Statutory document extracted and verified",
        data=result.dict()
    )
