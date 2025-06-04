from typing import List
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app import models, schemas


async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=user.password,
        latitude=user.latitude,
        longitude=user.longitude,
        skills=user.skills,
        availability=user.availability,
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def get_user(db: AsyncSession, user_id: UUID) -> models.User | None:
    return await db.get(models.User, user_id)


async def create_mission(db: AsyncSession, mission: schemas.MissionCreate) -> models.Mission:
    db_mission = models.Mission(
        title=mission.title,
        description=mission.description,
        latitude=mission.latitude,
        longitude=mission.longitude,
        created_by=mission.created_by,
    )
    db.add(db_mission)
    await db.commit()
    await db.refresh(db_mission)
    return db_mission


async def get_nearby_missions(db: AsyncSession, lat: float, lon: float, radius_km: float = 5.0) -> List[models.Mission]:
    earth_radius = 6371  # km

    distance_expr = earth_radius * func.acos(
        func.cos(func.radians(lat)) * func.cos(func.radians(models.Mission.latitude)) *
        func.cos(func.radians(models.Mission.longitude) - func.radians(lon)) +
        func.sin(func.radians(lat)) * func.sin(func.radians(models.Mission.latitude))
    )

    stmt = select(models.Mission).where(distance_expr <= radius_km)
    result = await db.execute(stmt)
    return result.scalars().all()

