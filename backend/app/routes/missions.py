from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_missions():
    return {"msg": "List of missions will go here."}
