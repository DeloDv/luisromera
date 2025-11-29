from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class ContactBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    subject: Optional[str] = Field(None, max_length=255)
    message: str = Field(..., min_length=10)

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    read: Optional[bool] = None
    replied: Optional[bool] = None

class ContactInDB(ContactBase):
    id: int
    read: bool
    replied: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Contact(ContactInDB):
    pass
