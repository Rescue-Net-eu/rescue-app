import os
from passlib.context import CryptContext

bcrypt_rounds = int(os.getenv("BCRYPT_ROUNDS", 12))

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=bcrypt_rounds,
)


def hash_password(password: str) -> str:
    """Return a bcrypt hashed password."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against the hashed version."""
    return pwd_context.verify(plain_password, hashed_password)
