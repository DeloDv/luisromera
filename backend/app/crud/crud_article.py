from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from slugify import slugify
from datetime import datetime

from app.models.article import Article
from app.schemas.article import ArticleCreate, ArticleUpdate

class CRUDArticle:
    def get(self, db: Session, article_id: int) -> Optional[Article]:
        """Get article by ID"""
        return db.query(Article).filter(Article.id == article_id).first()

    def get_by_slug(self, db: Session, slug: str) -> Optional[Article]:
        """Get article by slug"""
        return db.query(Article).filter(Article.slug == slug).first()

    def get_all(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100,
        published_only: bool = False
    ) -> List[Article]:
        """Get all articles"""
        query = db.query(Article)

        if published_only:
            query = query.filter(Article.published == True)

        return query.order_by(desc(Article.created_at)).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: ArticleCreate, author_id: int) -> Article:
        """Create new article"""
        # Generate unique slug
        base_slug = slugify(obj_in.title)
        slug = base_slug
        counter = 1

        while db.query(Article).filter(Article.slug == slug).first():
            slug = f"{base_slug}-{counter}"
            counter += 1

        db_obj = Article(
            **obj_in.model_dump(),
            slug=slug,
            author_id=author_id,
            published_at=datetime.utcnow() if obj_in.published else None
        )

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: Article, obj_in: ArticleUpdate) -> Article:
        """Update article"""
        update_data = obj_in.model_dump(exclude_unset=True)

        # Update slug if title changed
        if "title" in update_data:
            base_slug = slugify(update_data["title"])
            slug = base_slug
            counter = 1

            while db.query(Article).filter(
                Article.slug == slug,
                Article.id != db_obj.id
            ).first():
                slug = f"{base_slug}-{counter}"
                counter += 1

            update_data["slug"] = slug

        # Set published_at if publishing
        if "published" in update_data and update_data["published"] and not db_obj.published:
            update_data["published_at"] = datetime.utcnow()

        for field in update_data:
            setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, article_id: int) -> bool:
        """Delete article"""
        obj = db.query(Article).filter(Article.id == article_id).first()
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False

    def increment_views(self, db: Session, article_id: int) -> Optional[Article]:
        """Increment article views"""
        obj = db.query(Article).filter(Article.id == article_id).first()
        if obj:
            obj.views += 1
            db.add(obj)
            db.commit()
            db.refresh(obj)
            return obj
        return None

article = CRUDArticle()
