from pydantic import BaseModel, EmailStr, field_validator
import re

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v):
        pattern = r'^[\w\.-]+@[\w\.-]+\.\w{2,}$'
        if not re.match(pattern, v):
            raise ValueError("Format email tidak valid")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password minimal 8 karakter")
        if not any(c.isupper() for c in v):
            raise ValueError("Password harus mengandung minimal 1 huruf besar")
        return v

class RegisterResponse(BaseModel):
    message: str
    username: str