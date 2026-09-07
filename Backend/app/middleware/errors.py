import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("koyla_drishti.errors")

async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle standard HTTP exceptions with consistent government error schema."""
    error_code_map = {
        status.HTTP_400_BAD_REQUEST: "BAD_REQUEST",
        status.HTTP_401_UNAUTHORIZED: "UNAUTHORIZED",
        status.HTTP_403_FORBIDDEN: "FORBIDDEN",
        status.HTTP_404_NOT_FOUND: "NOT_FOUND",
        status.HTTP_409_CONFLICT: "CONFLICT",
        status.HTTP_413_REQUEST_ENTITY_TOO_LARGE: "PAYLOAD_TOO_LARGE",
        status.HTTP_422_UNPROCESSABLE_ENTITY: "VALIDATION_ERROR",
        status.HTTP_429_TOO_MANY_REQUESTS: "RATE_LIMITED",
        status.HTTP_500_INTERNAL_SERVER_ERROR: "INTERNAL_ERROR",
        status.HTTP_503_SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE"
    }

    error_code = error_code_map.get(exc.status_code, "ERROR")
    logger.warning(f"HTTP {exc.status_code} [{error_code}] on {request.method} {request.url.path}: {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": str(exc.detail),
            "error_code": error_code
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Format Pydantic schema validation errors into clear messages."""
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    field = ".".join([str(loc) for loc in first_error.get("loc", []) if loc != "body"])
    msg = first_error.get("msg", "Invalid input parameters")
    clean_message = f"Validation failure on '{field}': {msg}" if field else f"Validation failure: {msg}"

    logger.warning(f"Validation error on {request.method} {request.url.path}: {clean_message}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": clean_message,
            "error_code": "VALIDATION_ERROR"
        }
    )

async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all for unhandled server exceptions without leaking internal secrets."""
    logger.exception(f"Unhandled server exception on {request.method} {request.url.path}: {exc}")

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal system error occurred while processing the governance request.",
            "error_code": "INTERNAL_SERVER_ERROR"
        }
    )
