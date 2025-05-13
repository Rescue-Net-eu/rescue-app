from fastapi import FastAPI
from app.routes import users, missions

app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(missions.router, prefix="/missions", tags=["missions"])
