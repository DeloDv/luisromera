from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactUpdate

class CRUDContact:
    def get(self, db: Session, contact_id: int) -> Optional[Contact]:
        """Get contact by ID"""
        return db.query(Contact).filter(Contact.id == contact_id).first()

    def get_all(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        unread_only: bool = False
    ) -> List[Contact]:
        """Get all contacts"""
        query = db.query(Contact)

        if unread_only:
            query = query.filter(Contact.read == False)

        return query.order_by(desc(Contact.created_at)).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: ContactCreate) -> Contact:
        """Create new contact"""
        db_obj = Contact(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Contact, obj_in: ContactUpdate) -> Contact:
        """Update contact"""
        update_data = obj_in.model_dump(exclude_unset=True)

        for field in update_data:
            setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def mark_as_read(self, db: Session, contact_id: int) -> Optional[Contact]:
        """Mark contact as read"""
        obj = db.query(Contact).filter(Contact.id == contact_id).first()
        if obj:
            obj.read = True
            db.add(obj)
            db.commit()
            db.refresh(obj)
            return obj
        return None

    def mark_as_replied(self, db: Session, contact_id: int) -> Optional[Contact]:
        """Mark contact as replied"""
        obj = db.query(Contact).filter(Contact.id == contact_id).first()
        if obj:
            obj.replied = True
            db.add(obj)
            db.commit()
            db.refresh(obj)
            return obj
        return None

    def delete(self, db: Session, contact_id: int) -> bool:
        """Delete contact"""
        obj = db.query(Contact).filter(Contact.id == contact_id).first()
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False

contact = CRUDContact()
