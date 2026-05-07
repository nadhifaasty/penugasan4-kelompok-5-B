from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.models import RegisterRequest, RegisterResponse
from app.database import SessionLocal, User

router = APIRouter()

@router.post("/register")
def register(data: RegisterRequest):
    db = SessionLocal()
    try:
        if db.query(User).filter(User.username == data.username).first():
            return JSONResponse(status_code=400, content={"message": "Username sudah digunakan"})

        if db.query(User).filter(User.email == data.email).first():
            return JSONResponse(status_code=400, content={"message": "Email sudah digunakan"})

        new_user = User(
            username=data.username,
            email=data.email,
            password=data.password
        )
        db.add(new_user)
        db.commit()

        return RegisterResponse(message="Registrasi berhasil!", username=data.username)
    finally:
        db.close()