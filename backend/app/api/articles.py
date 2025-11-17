from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_superuser, get_current_active_user
from app.crud.crud_article import article as crud_article
from app.schemas.article import Article, ArticleCreate, ArticleUpdate, ArticleList
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ArticleList])
def get_articles(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    published_only: bool = True,
) -> Any:
    """
    Retrieve articles. Public endpoint shows only published articles.
    """
    articles = crud_article.get_all(
        db, skip=skip, limit=limit, published_only=published_only
    )
    return articles

@router.get("/admin", response_model=List[ArticleList])
def get_all_articles_admin(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Retrieve all articles (including unpublished). Admin only.
    """
    articles = crud_article.get_all(
        db, skip=skip, limit=limit, published_only=False
    )
    return articles

@router.get("/{article_id}", response_model=Article)
def get_article(
    article_id: int,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get article by ID
    """
    article = crud_article.get(db, article_id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    if not article.published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    # Increment views
    crud_article.increment_views(db, article_id=article_id)

    return article

@router.get("/slug/{slug}", response_model=Article)
def get_article_by_slug(
    slug: str,
    db: Session = Depends(get_db),
) -> Any:
    """
    Get article by slug
    """
    article = crud_article.get_by_slug(db, slug=slug)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    if not article.published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    # Increment views
    crud_article.increment_views(db, article_id=article.id)

    return article

@router.post("/", response_model=Article, status_code=status.HTTP_201_CREATED)
def create_article(
    article_in: ArticleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Create new article. Admin only.
    """
    article = crud_article.create(db, obj_in=article_in, author_id=current_user.id)
    return article

@router.put("/{article_id}", response_model=Article)
def update_article(
    article_id: int,
    article_in: ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> Any:
    """
    Update article. Admin only.
    """
    article = crud_article.get(db, article_id=article_id)
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )

    article = crud_article.update(db, db_obj=article, obj_in=article_in)
    return article

@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_superuser),
) -> None:
    """
    Delete article. Admin only.
    """
    success = crud_article.delete(db, article_id=article_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
