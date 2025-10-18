"""
Formularios de la aplicación
"""
from flask_wtf import FlaskForm
from wtforms import (StringField, PasswordField, BooleanField, TextAreaField, 
                     IntegerField, DateTimeField, SelectField)
from wtforms.validators import DataRequired, Length, Optional, Email


class LoginForm(FlaskForm):
    """Formulario de login"""
    username = StringField('Usuario', validators=[DataRequired()])
    password = PasswordField('Contraseña', validators=[DataRequired()])
    remember_me = BooleanField('Recordarme')


class PageForm(FlaskForm):
    """Formulario de páginas"""
    title = StringField('Título', validators=[DataRequired(), Length(max=200)])
    slug = StringField('Slug', validators=[DataRequired(), Length(max=200)])
    content_html = TextAreaField('Contenido HTML')
    meta_title = StringField('Meta Título', validators=[Length(max=200)])
    meta_description = TextAreaField('Meta Descripción', validators=[Length(max=300)])
    og_image = StringField('Imagen OG (URL)', validators=[Length(max=300)])
    is_published = BooleanField('Publicado')


class PostForm(FlaskForm):
    """Formulario de posts"""
    title = StringField('Título', validators=[DataRequired(), Length(max=200)])
    slug = StringField('Slug', validators=[DataRequired(), Length(max=200)])
    excerpt = TextAreaField('Extracto', validators=[Length(max=300)])
    content_html = TextAreaField('Contenido HTML', validators=[DataRequired()])
    cover_image = StringField('Imagen de portada (URL)', validators=[Length(max=300)])
    tags = StringField('Etiquetas (separadas por comas)', validators=[Length(max=200)])
    meta_description = TextAreaField('Meta Descripción', validators=[Length(max=300)])
    is_published = BooleanField('Publicado')
    published_at = DateTimeField('Fecha de publicación', format='%Y-%m-%dT%H:%M', validators=[Optional()])


class ServiceForm(FlaskForm):
    """Formulario de servicios"""
    name = StringField('Nombre', validators=[DataRequired(), Length(max=200)])
    slug = StringField('Slug', validators=[DataRequired(), Length(max=200)])
    description_html = TextAreaField('Descripción HTML', validators=[DataRequired()])
    icon_image = StringField('Imagen/Icono (URL)', validators=[Length(max=300)])
    price_from = StringField('Precio desde', validators=[Length(max=100)])
    order = IntegerField('Orden', default=0)
    is_active = BooleanField('Activo', default=True)


class TestimonialForm(FlaskForm):
    """Formulario de testimonios"""
    client_name = StringField('Nombre del cliente', validators=[DataRequired(), Length(max=200)])
    client_position = StringField('Cargo', validators=[Length(max=200)])
    client_company = StringField('Empresa', validators=[Length(max=200)])
    client_photo = StringField('Foto del cliente (URL)', validators=[Length(max=300)])
    content = TextAreaField('Testimonio', validators=[DataRequired()])
    rating = SelectField('Valoración', choices=[('', 'Sin valoración'), ('1', '⭐'), ('2', '⭐⭐'), 
                                                  ('3', '⭐⭐⭐'), ('4', '⭐⭐⭐⭐'), ('5', '⭐⭐⭐⭐⭐')],
                        coerce=lambda x: int(x) if x else None)
    is_approved = BooleanField('Aprobado')


class MenuItemForm(FlaskForm):
    """Formulario de elementos del menú"""
    label = StringField('Etiqueta', validators=[DataRequired(), Length(max=100)])
    url_or_slug = StringField('URL o Slug', validators=[DataRequired(), Length(max=200)])
    order = IntegerField('Orden', default=0)
    is_visible = BooleanField('Visible', default=True)


class SettingsForm(FlaskForm):
    """Formulario de configuración"""
    site_name = StringField('Nombre del sitio', validators=[Length(max=200)])
    colegiado_info = StringField('Info colegiado', validators=[Length(max=200)])
    phone = StringField('Teléfono', validators=[Length(max=50)])
    contact_email = StringField('Email de contacto', validators=[Length(max=100)])
    address = StringField('Dirección', validators=[Length(max=200)])
    schedule = StringField('Horario', validators=[Length(max=200)])
    
    # Hero section
    hero_badge = StringField('Badge del Hero', validators=[Length(max=200)])
    hero_title = TextAreaField('Título del Hero')
    hero_description = TextAreaField('Descripción del Hero')
    
    # Objectives
    objectives_title = TextAreaField('Título de objetivos')
    objectives_subtitle = TextAreaField('Subtítulo de objetivos')
    objectives_cta = TextAreaField('CTA de objetivos')
    
    # Footer
    footer_description = TextAreaField('Descripción del footer')
    footer_disclaimer = TextAreaField('Disclaimer del footer')
    
    # CTAs
    cta_button_text = StringField('Texto del botón CTA', validators=[Length(max=100)])
    
class ContactForm(FlaskForm):
    """Formulario de contacto"""
    name = StringField('Nombre', validators=[DataRequired(), Length(max=200)])
    email = StringField('Email', validators=[DataRequired(), Email(), Length(max=100)])
    phone = StringField('Teléfono', validators=[Optional(), Length(max=50)])
    message = TextAreaField('Mensaje', validators=[DataRequired()])