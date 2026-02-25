from datetime import datetime, timedelta
import hashlib
from typing import Any

import bcrypt
from jose import jwt

from app.core.config import settings

ALGORITHM = "HS256"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    encoded_hash = hashed_password.encode("utf-8")
    normalized = _normalize_password(plain_password)

    # Current scheme: sha256(password) -> bcrypt
    try:
        if bcrypt.checkpw(normalized, encoded_hash):
            return True
    except ValueError:
        return False

    # Legacy compatibility: direct bcrypt(password)
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), encoded_hash)
    except ValueError:
        return False


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(_normalize_password(password), bcrypt.gensalt()).decode("utf-8")


def _normalize_password(password: str) -> bytes:
    # Pre-hash avoids bcrypt's 72-byte input limit while preserving deterministic verify.
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("utf-8")


def create_access_token(subject: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode: dict[str, Any] = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)
