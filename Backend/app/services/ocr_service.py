import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.db.mongo import mongo_db
from app.schemas.ai import DocumentAnalysisResponse
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id
from ml.inference.document_parser import document_parser

logger = logging.getLogger("koyla_drishti.services.ocr")

async def process_statutory_document(
    file_bytes: bytes,
    filename: str,
    mine_id: Optional[str] = None,
    db: Optional[Session] = None,
    user: Optional[Any] = None
) -> DocumentAnalysisResponse:
    """Run OCR extraction, save raw token details in MongoDB, and validate structured fields."""
    parsed = document_parser.extract(file_bytes, filename)

    # Store raw extraction in MongoDB
    raw_doc_id = generate_id("OCR", 5)
    mongo_db.insert_document("document_extractions", {
        "id": raw_doc_id,
        "filename": filename,
        "mine_id": mine_id,
        "extracted_data": parsed,
        "raw_confidence": parsed["ocr_confidence"],
        "review_required": parsed["review_required"]
    })

    if db and user:
        record_audit_log(
            db=db,
            action="OCR_DOCUMENT_PROCESSED",
            entity_type="DOCUMENT",
            entity_id=raw_doc_id,
            user=user,
            details={
                "filename": filename,
                "confidence": parsed["ocr_confidence"],
                "review_required": parsed["review_required"]
            }
        )
        db.commit()

    return DocumentAnalysisResponse(
        mine_name=parsed["mine_name"],
        certificate_number=parsed["certificate_number"],
        inspection_date=parsed["inspection_date"],
        expiry_date=parsed["expiry_date"],
        officer_name=parsed["officer_name"],
        document_type=parsed["document_type"],
        ocr_confidence=parsed["ocr_confidence"],
        review_required=parsed["review_required"],
        extracted_fields=parsed
    )
