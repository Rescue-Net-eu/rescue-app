from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app import crud, schemas
from app.database import get_db

router = APIRouter()


@router.post("/create", response_model=schemas.MissionOut)
async def create_mission(mission: schemas.MissionCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_mission(db, mission)


@router.get("/nearby", response_model=List[schemas.MissionOut])
async def nearby_missions(lat: float, lon: float, db: AsyncSession = Depends(get_db)):
    missions = await crud.get_nearby_missions(db, lat, lon)
    return missions

