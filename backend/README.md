# Panel de Administración - Luis Romera Blog

Backend API completo con Python FastAPI para gestionar el blog y los artículos del sitio web de Luis Romera.

## 🚀 Características

- ✅ **API RESTful** con FastAPI
- ✅ **Autenticación JWT** para seguridad
- ✅ **CRUD completo** para artículos del blog
- ✅ **Gestión de contactos** desde el formulario web
- ✅ **Panel de administración** completo con interfaz web
- ✅ **Base de datos SQLite** (fácil de migrar a PostgreSQL)
- ✅ **Documentación automática** con Swagger UI
- ✅ **SEO optimizado** con meta tags personalizables
- ✅ **Generación automática de slugs**
- ✅ **Control de publicación** (borradores/publicados)

## 📋 Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
cd backend
```

### 2. Crear entorno virtual

```bash
python -m venv venv

# En Linux/Mac
source venv/bin/activate

# En Windows
venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Database
DATABASE_URL=sqlite:///./blog.db

# Security (CAMBIAR EN PRODUCCIÓN)
SECRET_KEY=tu-clave-secreta-muy-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Admin User
ADMIN_EMAIL=admin@luisromera.com
ADMIN_PASSWORD=tu-password-seguro

# CORS (Ajusta según tu dominio)
ALLOWED_ORIGINS=http://localhost:3000,https://tudominio.com
```

### 5. Inicializar la base de datos

```bash
python init_db.py
```

Esto creará:
- ✅ Todas las tablas necesarias
- ✅ Usuario administrador con las credenciales del `.env`

### 6. Ejecutar el servidor

```bash
python run.py
```

El servidor estará disponible en:
- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/api/docs
- **Panel Admin**: Abre `/admin/login.html` en tu navegador

## 📁 Estructura del Proyecto

```
backend/
├── app/
│   ├── api/              # Endpoints de la API
│   │   ├── auth.py       # Autenticación (login)
│   │   ├── articles.py   # CRUD de artículos
│   │   └── contacts.py   # Gestión de contactos
│   ├── core/             # Configuración y seguridad
│   │   ├── config.py     # Variables de configuración
│   │   ├── security.py   # JWT y hashing
│   │   └── deps.py       # Dependencias (auth)
│   ├── crud/             # Operaciones de base de datos
│   │   ├── crud_user.py
│   │   ├── crud_article.py
│   │   └── crud_contact.py
│   ├── db/               # Configuración de BD
│   │   └── database.py
│   ├── models/           # Modelos SQLAlchemy
│   │   ├── user.py
│   │   ├── article.py
│   │   └── contact.py
│   ├── schemas/          # Validación Pydantic
│   │   ├── user.py
│   │   ├── article.py
│   │   ├── contact.py
│   │   └── token.py
│   └── main.py           # Aplicación FastAPI
├── init_db.py            # Script de inicialización
├── run.py                # Script para ejecutar servidor
├── requirements.txt      # Dependencias
└── .env                  # Configuración (no incluir en git)
```

## 🎯 Endpoints de la API

### Autenticación

- `POST /api/auth/login` - Login (obtener token JWT)
- `GET /api/auth/me` - Información del usuario actual

### Artículos

- `GET /api/articles` - Listar artículos publicados (público)
- `GET /api/articles/admin` - Listar todos los artículos (admin)
- `GET /api/articles/{id}` - Obtener artículo por ID
- `GET /api/articles/slug/{slug}` - Obtener artículo por slug
- `POST /api/articles` - Crear artículo (admin)
- `PUT /api/articles/{id}` - Actualizar artículo (admin)
- `DELETE /api/articles/{id}` - Eliminar artículo (admin)

### Contactos

- `POST /api/contacts` - Crear contacto (público)
- `GET /api/contacts` - Listar contactos (admin)
- `GET /api/contacts/{id}` - Obtener contacto (admin)
- `PATCH /api/contacts/{id}/read` - Marcar como leído (admin)
- `PATCH /api/contacts/{id}/replied` - Marcar como respondido (admin)
- `DELETE /api/contacts/{id}` - Eliminar contacto (admin)

## 🔐 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación.

### Cómo autenticarse:

1. **Login**: Envía POST a `/api/auth/login` con:
   ```json
   {
     "username": "admin@luisromera.com",
     "password": "tu-password"
   }
   ```

2. **Respuesta**: Recibirás un token:
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIs...",
     "token_type": "bearer"
   }
   ```

3. **Usar el token**: Incluye en el header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

## 🎨 Panel de Administración

El panel de administración está en `/admin/`:

1. **Login**: `/admin/login.html`
2. **Dashboard**: `/admin/index.html`
3. **Artículos**: `/admin/articles.html`
4. **Contactos**: `/admin/contacts.html`

### Credenciales por defecto:
- Email: `admin@luisromera.com`
- Password: `admin123`

**⚠️ CAMBIAR ESTAS CREDENCIALES EN PRODUCCIÓN**

## 📝 Uso Básico

### Crear un artículo

```bash
curl -X POST "http://localhost:8000/api/articles" \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primer artículo",
    "description": "Descripción breve",
    "content": "Contenido completo del artículo...",
    "published": true,
    "meta_title": "Título SEO",
    "meta_description": "Descripción SEO"
  }'
```

### Obtener artículos publicados

```bash
curl "http://localhost:8000/api/articles"
```

## 🚀 Despliegue en Producción

### 1. Cambiar a PostgreSQL (recomendado)

Actualiza `DATABASE_URL` en `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost/luisromera_blog
```

Instala el driver:
```bash
pip install psycopg2-binary
```

### 2. Configurar variables de entorno

- Cambia `SECRET_KEY` a un valor aleatorio seguro
- Cambia `ADMIN_PASSWORD`
- Actualiza `ALLOWED_ORIGINS` con tu dominio

### 3. Usar servidor de producción

En lugar de `python run.py`, usa:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

O con Gunicorn:
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 4. Configurar HTTPS

Usa un proxy reverso como Nginx o Caddy para HTTPS.

### 5. Variables de entorno

NO incluyas el archivo `.env` en git. Usa variables de entorno del servidor.

## 🔧 Desarrollo

### Ejecutar en modo desarrollo

```bash
# Activar entorno virtual
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Ejecutar con recarga automática
python run.py
```

### Ver documentación interactiva

- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### Crear migraciones (Alembic)

```bash
# Inicializar Alembic (primera vez)
alembic init alembic

# Crear migración
alembic revision --autogenerate -m "Descripción del cambio"

# Aplicar migración
alembic upgrade head
```

## 🐛 Solución de Problemas

### Error: "Module not found"
```bash
pip install -r requirements.txt
```

### Error: "Database not found"
```bash
python init_db.py
```

### Error: "Unauthorized"
- Verifica que el token JWT sea válido
- Comprueba que no haya expirado (30 minutos por defecto)

### CORS Error
- Añade tu dominio a `ALLOWED_ORIGINS` en `.env`

## 📚 Tecnologías Utilizadas

- **FastAPI** - Framework web moderno
- **SQLAlchemy** - ORM para base de datos
- **Pydantic** - Validación de datos
- **JWT** - Autenticación
- **Uvicorn** - Servidor ASGI
- **SQLite/PostgreSQL** - Base de datos

## 🤝 Contribuir

Este es un proyecto privado para Luis Romera. Si necesitas hacer cambios:

1. Crea una rama nueva
2. Haz tus cambios
3. Prueba todo localmente
4. Crea un pull request

## 📄 Licencia

© 2024 Luis Romera - Todos los derechos reservados

## 📞 Soporte

Para soporte técnico, contacta al desarrollador del proyecto.
