from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.models import EventResponse, RegistrationRequest, RegistrationResponse
from app.database import SessionLocal, Event, Registration

router = APIRouter()

@router.get("/events", response_model=list[EventResponse])
def get_events():
    db = SessionLocal()
    try:
        events = db.query(Event).all()
        return events
    finally:
        db.close()

@router.post("/registrations")
def register_for_event(data: RegistrationRequest):
    db = SessionLocal()
    try:
        event = db.query(Event).filter(Event.id == data.eventId).first()
        if not event:
            return JSONResponse(status_code=404, content={"message": "Event tidak ditemukan"})

        registration = Registration(
            event_id=data.eventId,
            nama=data.nama,
            nim=data.nim,
            email=data.email,
        )
        db.add(registration)
        db.commit()

        return RegistrationResponse(message="Registrasi berhasil!")
    finally:
        db.close()
