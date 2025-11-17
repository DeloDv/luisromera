"""
Initialize database with tables and admin user
"""
from sqlalchemy.orm import Session
from app.db.database import engine, SessionLocal, Base
from app.models import User, Article, Contact
from app.core.config import settings
from app.core.security import get_password_hash

def init_db() -> None:
    """Initialize database"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")

    # Create admin user if not exists
    db: Session = SessionLocal()
    try:
        admin_user = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()

        if not admin_user:
            admin_user = User(
                email=settings.ADMIN_EMAIL,
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name="Administrador",
                is_active=True,
                is_superuser=True,
            )
            db.add(admin_user)
            db.commit()
            print(f"✓ Admin user created: {settings.ADMIN_EMAIL}")
            print(f"  Password: {settings.ADMIN_PASSWORD}")
            print("  ⚠️  CHANGE THE PASSWORD IN PRODUCTION!")
        else:
            print(f"✓ Admin user already exists: {settings.ADMIN_EMAIL}")

    finally:
        db.close()

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("✓ Database initialization complete!")
