import enum
import uuid
from sqlalchemy import Column, String, Boolean, Float, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class MissionStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    completed = "completed"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    availability = Column(Boolean, default=True)

    missions = relationship("Mission", secondary="user_missions", back_populates="participants")


class Mission(Base):
    __tablename__ = "missions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(Enum(MissionStatus), default=MissionStatus.pending, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    creator = relationship("User", backref="created_missions")
    participants = relationship("User", secondary="user_missions", back_populates="missions")


class UserMission(Base):
    __tablename__ = "user_missions"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    mission_id = Column(UUID(as_uuid=True), ForeignKey("missions.id"), primary_key=True)

