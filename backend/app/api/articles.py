"""
Articles API routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from slugify import slugify

from app.db.database import get_db
from app.models import Article, User
from app.schemas.article import ArticleRead, ArticleCreate, ArticleUpdate

# Try to import get_current_user from the correct location
try:
    from app.core.deps import get_current_user
except ImportError:
    try:
        from app.api.deps import get_current_user
    except ImportError:
        from app.core.security import get_current_active_user as get_current_user

router = APIRouter()


# PUBLIC ENDPOINTS (no authentication required)

@router.get("", response_model=List[ArticleRead])
async def get_published_articles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all published articles (public endpoint)
    """
    articles = db.query(Article)\
        .filter(Article.published == True)\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return articles


@router.get("/slug/{slug}", response_model=ArticleRead)
async def get_article_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Get article by slug (public endpoint)
    """
    article = db.query(Article).filter(Article.slug == slug).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Only return published articles to public
    if not article.published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    return article


@router.post("/{article_id}/view")
async def increment_article_views(
    article_id: int,
    db: Session = Depends(get_db)
):
    """
    Increment article view count (public endpoint)
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Increment views
    article.views = (article.views or 0) + 1
    db.commit()
    
    return {"success": True, "views": article.views}


# ADMIN ENDPOINTS (authentication required)

@router.get("/admin", response_model=List[ArticleRead])
async def get_all_articles_admin(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all articles including drafts (admin only)
    """
    articles = db.query(Article)\
        .order_by(Article.created_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return articles


@router.get("/{article_id}", response_model=ArticleRead)
async def get_article_by_id(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get article by ID (admin only)
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    return article


@router.post("", response_model=ArticleRead, status_code=status.HTTP_201_CREATED)
async def create_article(
    article_data: ArticleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create new article (admin only)
    """
    # Generate slug from title
    slug = slugify(article_data.title)
    
    # Check if slug already exists
    existing = db.query(Article).filter(Article.slug == slug).first()
    if existing:
        # Add a number to make it unique
        counter = 1
        while db.query(Article).filter(Article.slug == f"{slug}-{counter}").first():
            counter += 1
        slug = f"{slug}-{counter}"
    
    # Create article
    article = Article(
        **article_data.model_dump(),
        slug=slug,
        views=0
    )
    
    db.add(article)
    db.commit()
    db.refresh(article)
    
    return article


@router.put("/{article_id}", response_model=ArticleRead)
async def update_article(
    article_id: int,
    article_data: ArticleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update article (admin only)
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Update fields
    update_data = article_data.model_dump(exclude_unset=True)
    
    # If title is updated, regenerate slug
    if "title" in update_data:
        new_slug = slugify(update_data["title"])
        # Check if new slug conflicts with another article
        existing = db.query(Article).filter(
            Article.slug == new_slug,
            Article.id != article_id
        ).first()
        
        if existing:
            counter = 1
            while db.query(Article).filter(
                Article.slug == f"{new_slug}-{counter}",
                Article.id != article_id
            ).first():
                counter += 1
            new_slug = f"{new_slug}-{counter}"
        
        update_data["slug"] = new_slug
    
    for field, value in update_data.items():
        setattr(article, field, value)
    
    db.commit()
    db.refresh(article)
    
    return article


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete article (admin only)
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    db.delete(article)
    db.commit()
    
    return None