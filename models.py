"""
Modelos de la base de datos
"""
from datetime import datetime
from flask_login import UserMixin
from app import db


class User(UserMixin, db.Model):
    """Modelo de usuario administrador"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.username}>'


class Page(db.Model):
    """Modelo de páginas estáticas"""
    __tablename__ = 'pages'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    content_html = db.Column(db.Text)
    meta_title = db.Column(db.String(200))
    meta_description = db.Column(db.String(300))
    og_image = db.Column(db.String(300))
    is_published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Page {self.title}>'


class Post(db.Model):
    """Modelo de posts del blog"""
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    excerpt = db.Column(db.String(300))
    content_html = db.Column(db.Text, nullable=False)
    cover_image = db.Column(db.String(300))
    tags = db.Column(db.String(200))
    meta_description = db.Column(db.String(300))
    is_published = db.Column(db.Boolean, default=False)
    published_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def tag_list(self):
        """Retorna las etiquetas como lista"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []
    
    def __repr__(self):
        return f'<Post {self.title}>'


class Service(db.Model):
    """Modelo de servicios"""
    __tablename__ = 'services'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(200), unique=True, nullable=False)
    description_html = db.Column(db.Text)
    icon_image = db.Column(db.String(300))
    price_from = db.Column(db.String(100))
    order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Service {self.name}>'


class Testimonial(db.Model):
    """Modelo de testimonios"""
    __tablename__ = 'testimonials'
    
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(200), nullable=False)
    client_position = db.Column(db.String(200))
    client_company = db.Column(db.String(200))
    client_photo = db.Column(db.String(300))
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer)  # 1-5 estrellas
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Testimonial {self.client_name}>'


class MenuItem(db.Model):
    """Modelo de elementos del menú"""
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(100), nullable=False)
    url_or_slug = db.Column(db.String(200), nullable=False)
    order = db.Column(db.Integer, default=0)
    is_visible = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<MenuItem {self.label}>'


class Settings(db.Model):
    """Modelo de configuración global"""
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    site_name = db.Column(db.String(200), default='Luis Romera')
    colegiado_info = db.Column(db.String(200))
    phone = db.Column(db.String(50))
    contact_email = db.Column(db.String(100))
    address = db.Column(db.String(200))
    schedule = db.Column(db.String(200))
    
    # Hero section
    hero_badge = db.Column(db.String(200))
    hero_title = db.Column(db.Text)
    hero_description = db.Column(db.Text)
    
    # Objectives section
    objectives_title = db.Column(db.Text)
    objectives_subtitle = db.Column(db.Text)
    objectives_cta = db.Column(db.Text)
    
    # Footer
    footer_description = db.Column(db.Text)
    footer_disclaimer = db.Column(db.Text)
    
    # CTAs
    cta_button_text = db.Column(db.String(100), default='Consulta Gratuita')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Settings {self.site_name}>'