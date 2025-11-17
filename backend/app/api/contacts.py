from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_superuser
from app.crud.crud_contact import contact as crud_contact
from app.schemas.contact import Contact, ContactCreate, ContactUpdate
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Contact, status_code=status.HTTP_201_CREATED)
def create_contact(
    contact_in: ContactCreate,
    db: Session = Depends(get_db),
) -> Any:
    """
    Create new contact submission. Public endpoint.
    """
    contact = crud_contact.create(db, obj_in=contact_in)
    return contact

@router.get("/", response_model=List[Contact])
def get_contacts(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    unread_only: bool = False,
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Retrieve contacts. Admin only.
    """
    contacts = crud_contact.get_all(
        db, skip=skip, limit=limit, unread_only=unread_only
    )
    return contacts

@router.get("/{contact_id}", response_model=Contact)
def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Get contact by ID. Admin only.
    """
    contact = crud_contact.get(db, contact_id=contact_id)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return contact

@router.put("/{contact_id}", response_model=Contact)
def update_contact(
    contact_id: int,
    contact_in: ContactUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Update contact. Admin only.
    """
    contact = crud_contact.get(db, contact_id=contact_id)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )

    contact = crud_contact.update(db, db_obj=contact, obj_in=contact_in)
    return contact

@router.patch("/{contact_id}/read", response_model=Contact)
def mark_contact_as_read(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Mark contact as read. Admin only.
    """
    contact = crud_contact.mark_as_read(db, contact_id=contact_id)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return contact

@router.patch("/{contact_id}/replied", response_model=Contact)
def mark_contact_as_replied(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Mark contact as replied. Admin only.
    """
    contact = crud_contact.mark_as_replied(db, contact_id=contact_id)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return contact

@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> None:
    """
    Delete contact. Admin only.
    """
    success = crud_contact.delete(db, contact_id=contact_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
