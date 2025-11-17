"""
Article Pydantic schemas
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# Base schema with common fields
class ArticleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    description: Optional[str] = None
    content: str = Field(..., min_length=1)
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    published: bool = False


# Schema for creating articles
class ArticleCreate(ArticleBase):
    pass


# Schema for updating articles
class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    content: Optional[str] = Field(None, min_length=1)
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    published: Optional[bool] = None


# Schema for reading articles (response)
class ArticleRead(ArticleBase):
    id: int
    slug: str
    views: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None  # ✅ Ahora es opcional

    class Config:
        from_attributes = True  # Para Pydantic v2 (antes era orm_mode = True)


# Alias for compatibility
Article = ArticleRead


# Schema for article list (simplified)
class ArticleListItem(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str] = None
    featured_image: Optional[str] = None
    published: bool
    views: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Alias for compatibility
ArticleList = ArticleListItem