"""
Luis Romera CMS - Aplicación Flask Principal
"""
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from flask_wtf.csrf import CSRFProtect
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime

# Inicializar Flask
app = Flask(__name__, static_folder='assets', static_url_path='/assets')

# Configuración
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
csrf = CSRFProtect(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cms.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(app.static_folder, 'images', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Inicializar extensiones
from extensions import db
db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = 'admin_login'

# Importar modelos
from models import User, Page, Post, Service, Testimonial, MenuItem, Settings

# Importar formularios
from forms import (LoginForm, PageForm, PostForm, ServiceForm, 
                   TestimonialForm, MenuItemForm, SettingsForm, ContactForm)
# User loader para Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Context processor para variables globales
@app.context_processor
def inject_globals():
    settings = Settings.query.first()
    menu_items = MenuItem.query.filter_by(is_visible=True).order_by(MenuItem.order).all()
    return {
        'settings': settings,
        'menu_items': menu_items,
        'current_year': datetime.now().year
    }


# ============================================================================
# RUTAS PÚBLICAS
# ============================================================================

@app.route('/')
def index():
    """Página de inicio"""
    services = Service.query.filter_by(is_active=True).order_by(Service.order).limit(3).all()
    testimonials = Testimonial.query.filter_by(is_approved=True).limit(3).all()
    recent_posts = Post.query.filter_by(is_published=True).order_by(Post.published_at.desc()).limit(3).all()
    return render_template('public/index.html', 
                        services=services, 
                        testimonials=testimonials,
                        recent_posts=recent_posts)

@app.route('/sobre-mi')
def sobre_mi():
    """Página sobre mí"""
    page = Page.query.filter_by(slug='sobre_mi', is_published=True).first_or_404()
    return render_template('public/sobre-mi.html', page=page)

@app.route('/servicios')
def servicios():
    """Página de servicios"""
    services = Service.query.filter_by(is_active=True).order_by(Service.order).all()
    return render_template('public/servicios.html', services=services)

@app.route('/blog')
def blog():
    """Listado de posts del blog"""
    page = request.args.get('page', 1, type=int)
    posts = Post.query.filter_by(is_published=True).order_by(Post.published_at.desc()).paginate(
        page=page, per_page=9, error_out=False
    )
    return render_template('public/blog.html', posts=posts)

@app.route('/blog/<slug>')
def articulo(slug):
    """Detalle de un post"""
    post = Post.query.filter_by(slug=slug, is_published=True).first_or_404()
    related_posts = Post.query.filter(
        Post.id != post.id,
        Post.is_published == True
    ).order_by(Post.published_at.desc()).limit(3).all()
    return render_template('public/articulo.html', post=post, related_posts=related_posts)

@app.route('/contacto', methods=['GET', 'POST'])
def contacto():
    """Página de contacto"""
    form = ContactForm()
    
    if form.validate_on_submit():
        name = form.name.data
        email = form.email.data
        phone = form.phone.data
        message = form.message.data
        
        # TODO: Aquí implementarías el envío de email
        
        flash('Mensaje enviado correctamente. Te contactaremos pronto.', 'success')
        return redirect(url_for('contacto'))
    
    return render_template('public/contacto.html', form=form)

@app.route('/aviso-legal')
def aviso_legal():
    """Página de aviso legal"""
    page = Page.query.filter_by(slug='aviso_legal', is_published=True).first_or_404()
    return render_template('public/aviso-legal.html', page=page)

@app.route('/<slug>')
def pagina_dinamica(slug):
    """Ruta dinámica para páginas personalizadas"""
    page = Page.query.filter_by(slug=slug, is_published=True).first_or_404()
    return render_template('public/base.html', page=page)


# ============================================================================
# ADMIN - AUTENTICACIÓN
# ============================================================================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Login del administrador"""
    if current_user.is_authenticated:
        return redirect(url_for('admin_dashboard'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password_hash, form.password.data):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            return redirect(next_page if next_page else url_for('admin_dashboard'))
        flash('Usuario o contraseña incorrectos', 'danger')
    return render_template('admin/login.html', form=form)

@app.route('/admin/logout')
@login_required
def admin_logout():
    """Cerrar sesión"""
    logout_user()
    return redirect(url_for('index'))


# ============================================================================
# ADMIN - DASHBOARD
# ============================================================================

@app.route('/admin')
@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    """Dashboard del administrador"""
    stats = {
        'total_pages': Page.query.count(),
        'published_pages': Page.query.filter_by(is_published=True).count(),
        'total_posts': Post.query.count(),
        'draft_posts': Post.query.filter_by(is_published=False).count(),
        'total_services': Service.query.filter_by(is_active=True).count(),
        'total_testimonials': Testimonial.query.count(),
        'approved_testimonials': Testimonial.query.filter_by(is_approved=True).count()
    }
    recent_posts = Post.query.order_by(Post.created_at.desc()).limit(5).all()
    return render_template('admin/dashboard.html', stats=stats, recent_posts=recent_posts)


# ============================================================================
# ADMIN - PÁGINAS
# ============================================================================

@app.route('/admin/pages')
@login_required
def pages_list():
    """Listado de páginas"""
    page_num = request.args.get('page', 1, type=int)
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    
    query = Page.query
    
    if search:
        query = query.filter(Page.title.contains(search) | Page.slug.contains(search))
    if status == 'published':
        query = query.filter_by(is_published=True)
    elif status == 'draft':
        query = query.filter_by(is_published=False)
    
    pages = query.order_by(Page.updated_at.desc()).paginate(
        page=page_num, per_page=10, error_out=False
    )
    return render_template('admin/pages/list.html', pages=pages)

@app.route('/admin/pages/create', methods=['GET', 'POST'])
@login_required
def pages_create():
    """Crear nueva página"""
    form = PageForm()
    if form.validate_on_submit():
        page = Page(
            title=form.title.data,
            slug=form.slug.data,
            content_html=form.content_html.data,
            meta_title=form.meta_title.data,
            meta_description=form.meta_description.data,
            og_image=form.og_image.data,
            is_published=form.is_published.data
        )
        db.session.add(page)
        db.session.commit()
        flash('Página creada correctamente', 'success')
        return redirect(url_for('pages_list'))
    return render_template('admin/pages/create.html', form=form, page=None)

@app.route('/admin/pages/<int:page_id>/edit', methods=['GET', 'POST'])
@login_required
def pages_edit(page_id):
    """Editar página"""
    page = Page.query.get_or_404(page_id)
    form = PageForm(obj=page)
    
    if form.validate_on_submit():
        page.title = form.title.data
        page.slug = form.slug.data
        page.content_html = form.content_html.data
        page.meta_title = form.meta_title.data
        page.meta_description = form.meta_description.data
        page.og_image = form.og_image.data
        page.is_published = form.is_published.data
        page.updated_at = datetime.utcnow()
        db.session.commit()
        flash('Página actualizada correctamente', 'success')
        return redirect(url_for('pages_list'))
    
    return render_template('admin/pages/create.html', form=form, page=page)

@app.route('/admin/pages/<int:page_id>/delete', methods=['POST'])
@login_required
def pages_delete(page_id):
    """Eliminar página"""
    page = Page.query.get_or_404(page_id)
    db.session.delete(page)
    db.session.commit()
    flash('Página eliminada correctamente', 'success')
    return redirect(url_for('pages_list'))


# ============================================================================
# ADMIN - POSTS DEL BLOG
# ============================================================================

@app.route('/admin/posts')
@login_required
def posts_list():
    """Listado de posts"""
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    
    query = Post.query
    
    if search:
        query = query.filter(Post.title.contains(search) | Post.slug.contains(search))
    if status == 'published':
        query = query.filter_by(is_published=True)
    elif status == 'draft':
        query = query.filter_by(is_published=False)
    
    posts = query.order_by(Post.updated_at.desc()).paginate(
        page=page, per_page=10, error_out=False
    )
    return render_template('admin/posts/list.html', posts=posts)

@app.route('/admin/posts/create', methods=['GET', 'POST'])
@login_required
def posts_create():
    """Crear nuevo post"""
    form = PostForm()
    if form.validate_on_submit():
        post = Post(
            title=form.title.data,
            slug=form.slug.data,
            excerpt=form.excerpt.data,
            content_html=form.content_html.data,
            cover_image=form.cover_image.data,
            tags=form.tags.data,
            meta_description=form.meta_description.data,
            is_published=form.is_published.data,
            published_at=datetime.utcnow() if form.is_published.data else None
        )
        db.session.add(post)
        db.session.commit()
        flash('Post creado correctamente', 'success')
        return redirect(url_for('posts_list'))
    return render_template('admin/posts/create.html', form=form, post=None)

@app.route('/admin/posts/<int:post_id>/edit', methods=['GET', 'POST'])
@login_required
def posts_edit(post_id):
    """Editar post"""
    post = Post.query.get_or_404(post_id)
    form = PostForm(obj=post)
    
    if form.validate_on_submit():
        was_draft = not post.is_published
        post.title = form.title.data
        post.slug = form.slug.data
        post.excerpt = form.excerpt.data
        post.content_html = form.content_html.data
        post.cover_image = form.cover_image.data
        post.tags = form.tags.data
        post.meta_description = form.meta_description.data
        post.is_published = form.is_published.data
        post.updated_at = datetime.utcnow()
        
        # Si era borrador y se publica ahora
        if was_draft and form.is_published.data:
            post.published_at = datetime.utcnow()
        
        db.session.commit()
        flash('Post actualizado correctamente', 'success')
        return redirect(url_for('posts_list'))
    
    return render_template('admin/posts/create.html', form=form, post=post)

@app.route('/admin/posts/<int:post_id>/delete', methods=['POST'])
@login_required
def posts_delete(post_id):
    """Eliminar post"""
    post = Post.query.get_or_404(post_id)
    db.session.delete(post)
    db.session.commit()
    flash('Post eliminado correctamente', 'success')
    return redirect(url_for('posts_list'))


# ============================================================================
# ADMIN - SERVICIOS
# ============================================================================

@app.route('/admin/services')
@login_required
def services_list():
    """Listado de servicios"""
    services = Service.query.order_by(Service.order).all()
    return render_template('admin/services/list.html', services=services)

@app.route('/admin/services/create', methods=['GET', 'POST'])
@login_required
def services_create():
    """Crear nuevo servicio"""
    form = ServiceForm()
    if form.validate_on_submit():
        service = Service(
            name=form.name.data,
            slug=form.slug.data,
            description_html=form.description_html.data,
            icon_image=form.icon_image.data,
            price_from=form.price_from.data,
            order=form.order.data,
            is_active=form.is_active.data
        )
        db.session.add(service)
        db.session.commit()
        flash('Servicio creado correctamente', 'success')
        return redirect(url_for('services_list'))
    return render_template('admin/services/create.html', form=form, service=None)

@app.route('/admin/services/<int:service_id>/edit', methods=['GET', 'POST'])
@login_required
def services_edit(service_id):
    """Editar servicio"""
    service = Service.query.get_or_404(service_id)
    form = ServiceForm(obj=service)
    
    if form.validate_on_submit():
        service.name = form.name.data
        service.slug = form.slug.data
        service.description_html = form.description_html.data
        service.icon_image = form.icon_image.data
        service.price_from = form.price_from.data
        service.order = form.order.data
        service.is_active = form.is_active.data
        service.updated_at = datetime.utcnow()
        db.session.commit()
        flash('Servicio actualizado correctamente', 'success')
        return redirect(url_for('services_list'))
    
    return render_template('admin/services/create.html', form=form, service=service)

@app.route('/admin/services/<int:service_id>/delete', methods=['POST'])
@login_required
def services_delete(service_id):
    """Eliminar servicio"""
    service = Service.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    flash('Servicio eliminado correctamente', 'success')
    return redirect(url_for('services_list'))


# ============================================================================
# ADMIN - TESTIMONIOS
# ============================================================================

@app.route('/admin/testimonials')
@login_required
def testimonials_list():
    """Listado de testimonios"""
    status = request.args.get('status', '')
    query = Testimonial.query
    
    if status == 'approved':
        query = query.filter_by(is_approved=True)
    elif status == 'pending':
        query = query.filter_by(is_approved=False)
    
    testimonials = query.order_by(Testimonial.created_at.desc()).all()
    return render_template('admin/testimonials/list.html', testimonials=testimonials)

@app.route('/admin/testimonials/create', methods=['GET', 'POST'])
@login_required
def testimonials_create():
    """Crear nuevo testimonio"""
    form = TestimonialForm()
    if form.validate_on_submit():
        testimonial = Testimonial(
            client_name=form.client_name.data,
            client_position=form.client_position.data,
            client_company=form.client_company.data,
            client_photo=form.client_photo.data,
            content=form.content.data,
            rating=form.rating.data,
            is_approved=form.is_approved.data
        )
        db.session.add(testimonial)
        db.session.commit()
        flash('Testimonio creado correctamente', 'success')
        return redirect(url_for('testimonials_list'))
    return render_template('admin/testimonials/create.html', form=form, testimonial=None)

@app.route('/admin/testimonials/<int:testimonial_id>/edit', methods=['GET', 'POST'])
@login_required
def testimonials_edit(testimonial_id):
    """Editar testimonio"""
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    form = TestimonialForm(obj=testimonial)
    
    if form.validate_on_submit():
        testimonial.client_name = form.client_name.data
        testimonial.client_position = form.client_position.data
        testimonial.client_company = form.client_company.data
        testimonial.client_photo = form.client_photo.data
        testimonial.content = form.content.data
        testimonial.rating = form.rating.data
        testimonial.is_approved = form.is_approved.data
        db.session.commit()
        flash('Testimonio actualizado correctamente', 'success')
        return redirect(url_for('testimonials_list'))
    
    return render_template('admin/testimonials/create.html', form=form, testimonial=testimonial)

@app.route('/admin/testimonials/<int:testimonial_id>/approve', methods=['POST'])
@login_required
def testimonials_approve(testimonial_id):
    """Aprobar testimonio"""
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    testimonial.is_approved = True
    db.session.commit()
    flash('Testimonio aprobado correctamente', 'success')
    return redirect(url_for('testimonials_list'))

@app.route('/admin/testimonials/<int:testimonial_id>/delete', methods=['POST'])
@login_required
def testimonials_delete(testimonial_id):
    """Eliminar testimonio"""
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    db.session.delete(testimonial)
    db.session.commit()
    flash('Testimonio eliminado correctamente', 'success')
    return redirect(url_for('testimonials_list'))


# ============================================================================
# ADMIN - MENÚ
# ============================================================================

@app.route('/admin/menu')
@login_required
def menu_list():
    """Gestión del menú"""
    menu_items = MenuItem.query.order_by(MenuItem.order).all()
    return render_template('admin/menu/list.html', menu_items=menu_items)

@app.route('/admin/menu/create', methods=['GET', 'POST'])
@login_required
def menu_create():
    """Crear elemento de menú"""
    form = MenuItemForm()
    if form.validate_on_submit():
        menu_item = MenuItem(
            label=form.label.data,
            url_or_slug=form.url_or_slug.data,
            order=form.order.data,
            is_visible=form.is_visible.data
        )
        db.session.add(menu_item)
        db.session.commit()
        flash('Elemento de menú creado correctamente', 'success')
        return redirect(url_for('menu_list'))
    return render_template('admin/menu/create.html', form=form, menu_item=None)

@app.route('/admin/menu/<int:menu_id>/edit', methods=['GET', 'POST'])
@login_required
def menu_edit(menu_id):
    """Editar elemento de menú"""
    menu_item = MenuItem.query.get_or_404(menu_id)
    form = MenuItemForm(obj=menu_item)
    
    if form.validate_on_submit():
        menu_item.label = form.label.data
        menu_item.url_or_slug = form.url_or_slug.data
        menu_item.order = form.order.data
        menu_item.is_visible = form.is_visible.data
        db.session.commit()
        flash('Elemento de menú actualizado correctamente', 'success')
        return redirect(url_for('menu_list'))
    
    return render_template('admin/menu/create.html', form=form, menu_item=menu_item)

@app.route('/admin/menu/<int:menu_id>/delete', methods=['POST'])
@login_required
def menu_delete(menu_id):
    """Eliminar elemento de menú"""
    menu_item = MenuItem.query.get_or_404(menu_id)
    db.session.delete(menu_item)
    db.session.commit()
    flash('Elemento de menú eliminado correctamente', 'success')
    return redirect(url_for('menu_list'))


# ============================================================================
# ADMIN - CONFIGURACIÓN
# ============================================================================

@app.route('/admin/settings', methods=['GET', 'POST'])
@login_required
def settings_edit():
    """Editar configuración global"""
    settings = Settings.query.first()
    if not settings:
        settings = Settings()
        db.session.add(settings)
        db.session.commit()
    
    form = SettingsForm(obj=settings)
    
    if form.validate_on_submit():
        form.populate_obj(settings)
        db.session.commit()
        flash('Configuración actualizada correctamente', 'success')
        return redirect(url_for('admin_dashboard'))
    
    return render_template('admin/settings/edit.html', form=form, settings=settings)


# ============================================================================
# ADMIN - MEDIOS
# ============================================================================

@app.route('/admin/media')
@login_required
def media_library():
    """Biblioteca de medios"""
    # Por ahora solo renderiza la plantilla
    # Implementarías la lógica de gestión de archivos aquí
    form = FlaskForm()
    return render_template('admin/media/library.html', files=[], form=form)


# ============================================================================
# MANEJADORES DE ERRORES
# ============================================================================

@app.errorhandler(404)
def page_not_found(e):
    """Página no encontrada"""
    return render_template('public/404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    """Error interno del servidor"""
    return render_template('public/404.html'), 500


# ============================================================================
# INICIAR APLICACIÓN
# ============================================================================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)