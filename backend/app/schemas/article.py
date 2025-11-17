from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ArticleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    content: str = Field(..., min_length=1)
    featured_image: Optional[str] = None
    published: bool = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    content: Optional[str] = Field(None, min_length=1)
    featured_image: Optional[str] = None
    published: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None

class ArticleInDB(ArticleBase):
    id: int
    slug: str
    author_id: int
    views: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Article(ArticleInDB):
    pass

class ArticleList(BaseModel):
    id: int
    title: str
    slug: str
    description: Optional[str]
    featured_image: Optional[str]
    published: bool
    views: int
    created_at: datetime
    published_at: Optional[datetime]

    class Config:
        from_attributes = True
