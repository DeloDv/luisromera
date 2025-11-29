"""
Run the FastAPI application
"""
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    print(f"Starting {settings.APP_NAME}...")
    print(f"API Documentation: http://127.0.0.1:8000/api/docs")
    print(f"Admin credentials: {settings.ADMIN_EMAIL} / {settings.ADMIN_PASSWORD}")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
