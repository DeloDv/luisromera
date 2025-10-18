"""
Script para poblar la base de datos con datos iniciales
"""
from app import app, db
from models import User, Page, Post, Service, Testimonial, MenuItem, Settings
from werkzeug.security import generate_password_hash
from datetime import datetime
import os

def seed_database():
    """Seed the database with initial data"""
    # CORRECCIÓN: Crear carpeta instance si no existe
    instance_path = os.path.join(os.path.dirname(__file__), 'instance')
    if not os.path.exists(instance_path):
        os.makedirs(instance_path)
        print(f"✅ Carpeta 'instance' creada")
    
    print("Creando tablas...")
    db.create_all()
    print("🗄️  Base de datos inicializada")
    
    # Crear usuario admin
    admin = User(
        username='admin',
        password_hash=generate_password_hash('admin123')
    )
    db.session.add(admin)
    db.session.commit()
    print("👤 Usuario admin creado")
    
    # Crear páginas iniciales
    pages_data = [
        {
            'title': 'Inicio',
            'slug': 'index',
            'content_html': '<h1>Bienvenido a Luis Romera</h1><p>Psicólogo y Consultor Organizacional</p>',
            'meta_title': 'Luis Romera | Psicólogo & Consultor Organizacional',
            'meta_description': 'Transformamos equipos comerciales integrando estrategia, personas y resultados.',
            'is_published': True
        },
        {
            'title': 'Sobre mí',
            'slug': 'sobre_mi',
            'content_html': '<h1>Luis Romera Navarro</h1><p>Psicólogo colegiado con más de 20 años de experiencia.</p>',
            'meta_title': 'Sobre mí - Luis Romera',
            'meta_description': '20 años de experiencia integrando estrategia, personas y resultados.',
            'is_published': True
        },
        {
            'title': 'Servicios',
            'slug': 'servicios',
            'content_html': '<h1>Servicios de Consultoría Organizacional</h1>',
            'meta_title': 'Servicios | Luis Romera',
            'meta_description': 'Coaching Ejecutivo, Eficacia Comercial, Formación para Managers.',
            'is_published': True
        },
        {
            'title': 'Contacto',
            'slug': 'contacto',
            'content_html': '<h1>Contacto</h1><p>Hablemos de cómo multiplicar tus ventas.</p>',
            'meta_title': 'Contacto | Luis Romera',
            'meta_description': 'Primera consulta sin compromiso.',
            'is_published': True
        },
        {
            'title': 'Aviso Legal',
            'slug': 'aviso_legal',
            'content_html': '<h1>Aviso Legal</h1><p>Información legal del sitio web.</p>',
            'meta_title': 'Aviso Legal | Luis Romera',
            'is_published': True
        }
    ]
    
    for page_data in pages_data:
        page = Page(**page_data)
        db.session.add(page)
    
    db.session.commit()
    print(f"📄 {len(pages_data)} páginas creadas")
    
    # Posts de ejemplo
    posts_data = [
        {
            'title': '5 Competencias Clave del Líder Transformacional',
            'slug': '5-competencias-clave-lider-transformacional',
            'excerpt': 'Descubre las 5 competencias esenciales que todo líder transformacional debe desarrollar.',
            'content_html': '<h2>Introducción</h2><p>El liderazgo transformacional es fundamental para el éxito organizacional...</p>',
            'cover_image': '/assets/images/blog/liderazgo.jpg',
            'tags': 'liderazgo,coaching,transformación',
            'is_published': True,
            'published_at': datetime.now()
        },
        {
            'title': 'Cómo el Coaching Potencia el ROI de tu Organización',
            'slug': 'coaching-potencia-roi-organizacion',
            'excerpt': 'Análisis del retorno de inversión en coaching ejecutivo con datos reales del mercado.',
            'content_html': '<h2>El ROI del Coaching</h2><p>Según estudios de PWC-ICF, el coaching ejecutivo genera un ROI promedio de 700%...</p>',
            'cover_image': '/assets/images/blog/coaching.jpg',
            'tags': 'coaching,roi,resultados',
            'is_published': True,
            'published_at': datetime.now()
        },
        {
            'title': 'KPIs que Realmente Importan en Equipos Comerciales',
            'slug': 'kpis-equipos-comerciales',
            'excerpt': 'Más allá de las métricas tradicionales: KPIs que conectan actividad con resultados reales.',
            'content_html': '<h2>KPIs Estratégicos</h2><p>Los KPIs correctos pueden transformar la eficacia de tu equipo comercial...</p>',
            'cover_image': '/assets/images/blog/kpis.jpg',
            'tags': 'ventas,kpis,eficacia comercial',
            'is_published': False
        }
    ]
    
    for post_data in posts_data:
        post = Post(**post_data)
        db.session.add(post)
    
    db.session.commit()
    print(f"📝 {len(posts_data)} posts de blog creados")
    
    # Servicios
    services_data = [
        {
            'name': 'Coaching Ejecutivo',
            'slug': 'coaching',
            'description_html': '<p>Procesos personalizados de acompañamiento para directivos y líderes.</p><ul><li>Desarrollo de liderazgo</li><li>Inteligencia emocional</li><li>Gestión del cambio</li></ul>',
            'price_from': 'Desde 800€',
            'order': 1,
            'is_active': True
        },
        {
            'name': 'Eficacia Comercial (SFE)',
            'slug': 'eficacia',
            'description_html': '<p>Sales Force Effectiveness para transformar tu equipo de ventas.</p><ul><li>Optimización de territorios</li><li>KPIs y medición</li><li>CRM y herramientas digitales</li></ul>',
            'price_from': 'Consultar',
            'order': 2,
            'is_active': True
        },
        {
            'name': 'Formación para Managers',
            'slug': 'formacion',
            'description_html': '<p>Programas de formación práctica para líderes de equipo.</p><ul><li>Liderazgo situacional</li><li>Gestión del rendimiento</li><li>Comunicación efectiva</li></ul>',
            'price_from': 'Desde 1200€',
            'order': 3,
            'is_active': True
        }
    ]
    
    for service_data in services_data:
        service = Service(**service_data)
        db.session.add(service)
    
    db.session.commit()
    print(f"💼 {len(services_data)} servicios creados")
    
    # Testimonios
    testimonials_data = [
        {
            'client_name': 'María González',
            'client_position': 'Directora General',
            'client_company': 'Tech Solutions S.L.',
            'content': 'El trabajo de Luis con nuestro equipo comercial fue transformador. En 6 meses aumentamos la facturación un 35% y la motivación del equipo está por las nubes.',
            'rating': 5,
            'is_approved': True
        },
        {
            'client_name': 'Carlos Martínez',
            'client_position': 'CEO',
            'client_company': 'Innovatech',
            'content': 'El coaching ejecutivo con Luis me ayudó a desarrollar habilidades de liderazgo que no sabía que necesitaba. Totalmente recomendable.',
            'rating': 5,
            'is_approved': True
        }
    ]
    
    for testimonial_data in testimonials_data:
        testimonial = Testimonial(**testimonial_data)
        db.session.add(testimonial)
    
    db.session.commit()
    print(f"⭐ {len(testimonials_data)} testimonios creados")
    
    # Menú
    menu_items_data = [
        {'label': 'Inicio', 'url_or_slug': '/', 'order': 1, 'is_visible': True},
        {'label': 'Servicios', 'url_or_slug': '/servicios', 'order': 2, 'is_visible': True},
        {'label': 'Sobre mí', 'url_or_slug': '/sobre-mi', 'order': 3, 'is_visible': True},
        {'label': 'Blog', 'url_or_slug': '/blog', 'order': 4, 'is_visible': True},
        {'label': 'Contacto', 'url_or_slug': '/contacto', 'order': 5, 'is_visible': True}
    ]
    
    for menu_data in menu_items_data:
        menu_item = MenuItem(**menu_data)
        db.session.add(menu_item)
    
    db.session.commit()
    print(f"🔗 {len(menu_items_data)} elementos de menú creados")
    
    # Configuración
    settings = Settings(
        site_name='Luis Romera',
        colegiado_info='N.º Colegiado: M-36199',
        phone='+34 609 430 403',
        contact_email='luisromeranavarro@gmail.com',
        address='Madrid, España',
        schedule='Lunes - Viernes: 9:00 - 18:00',
        hero_badge='✓ Especialista en Crecimiento Comercial',
        hero_title='Multiplica tus <span class="highlight">ventas</span> sin quemar a tu equipo',
        hero_description='Consultoría organizacional que integra psicología, estrategia comercial y desarrollo de personas.',
        objectives_title='¿Quieres <span class="highlight">aumentar tu facturación</span> sin sacrificar el bienestar de tu equipo?',
        objectives_subtitle='Te ayudo a conseguirlo de forma sostenible',
        objectives_cta='→ Acompañamiento personalizado que integra estrategia y personas',
        footer_description='Psicólogo y Consultor Organizacional especializado en transformar equipos comerciales.',
        footer_disclaimer='*Los datos de ROI corresponden a estudios independientes de organizaciones profesionales.',
        cta_button_text='Consulta Gratuita'
    )
    db.session.add(settings)
    db.session.commit()
    print("⚙️  Configuración inicial guardada")
    
    print("\n✅ ¡Seed completado exitosamente!")
    print("\n📝 Credenciales de acceso:")
    print("   Usuario: admin")
    print("   Contraseña: admin123")
    print("\n🌐 Inicia la aplicación con: flask run --debug")
    print("🔐 Accede al admin en: http://localhost:5000/admin/login\n")

if __name__ == '__main__':
    with app.app_context():
        # Eliminar todas las tablas existentes
        db.drop_all()
        print("🗑️  Tablas anteriores eliminadas")
        
        # Crear nuevas tablas y poblar
        seed_database()