from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from datetime import datetime
from app.models import MissionStatus


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    skills: List[str] = []
    availability: bool = True


class UserOut(BaseModel):
    id: UUID
    name: str
    email: str
    latitude: Optional[float]
    longitude: Optional[float]
    skills: List[str] = []
    availability: bool

    class Config:
        orm_mode = True


class MissionCreate(BaseModel):
    title: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    created_by: UUID


class MissionOut(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    latitude: float
    longitude: float
    status: MissionStatus
    timestamp: datetime
    created_by: UUID

    class Config:
        orm_mode = True


class NearbyMissionRequest(BaseModel):
    latitude: float
    longitude: float
    radius_km: float = 5.0

