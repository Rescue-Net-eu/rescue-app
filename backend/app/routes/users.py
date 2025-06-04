from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app import crud, schemas
from app.database import get_db

router = APIRouter()


@router.post("/register", response_model=schemas.UserOut)
async def register_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    db_user = await crud.create_user(db, user)
    return db_user


@router.get("/{user_id}", response_model=schemas.UserOut)
async def get_user(user_id: UUID, db: AsyncSession = Depends(get_db)):
    """Retrieve a user by UUID."""
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

