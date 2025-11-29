from fastapi import APIRouter
from app.api import auth, articles, contacts

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(articles.router, prefix="/articles", tags=["articles"])
api_router.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
