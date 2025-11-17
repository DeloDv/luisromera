# Guía de Instalación - Luis Romera Blog

Esta guía te ayudará a configurar y ejecutar el proyecto completo (frontend + backend + panel de administración).

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación del Backend](#instalación-del-backend)
3. [Configuración del Frontend](#configuración-del-frontend)
4. [Primer Inicio](#primer-inicio)
5. [Uso del Panel de Administración](#uso-del-panel-de-administración)

## 🖥️ Requisitos del Sistema

- **Python 3.8+** (para el backend)
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)
- **Editor de texto** (opcional, para editar configuración)

## 🐍 Instalación del Backend

### Paso 1: Abrir terminal en la carpeta backend

```bash
cd backend
```

### Paso 2: Crear entorno virtual de Python

**En Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**En Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

Verás que aparece `(venv)` al inicio de tu terminal.

### Paso 3: Instalar dependencias

```bash
pip install -r requirements.txt
```

Esto puede tardar 1-2 minutos. Instalará todas las librerías necesarias.

### Paso 4: Configurar variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus datos:
   - Cambia `ADMIN_EMAIL` a tu email
   - Cambia `ADMIN_PASSWORD` a una contraseña segura
   - Ajusta otros valores si es necesario

### Paso 5: Inicializar la base de datos

```bash
python init_db.py
```

Verás mensajes de confirmación como:
```
✓ Database tables created
✓ Admin user created: admin@luisromera.com
```

### Paso 6: Ejecutar el servidor

```bash
python run.py
```

Verás algo como:
```
Starting Luis Romera Blog API...
API Documentation: http://127.0.0.1:8000/api/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**¡El backend ya está corriendo! No cierres esta terminal.**

## 🌐 Configuración del Frontend

### Paso 1: Actualizar la URL de la API en el frontend

El formulario de contacto necesita saber dónde está la API.

1. Abre el archivo `/assets/js/contact.js`
2. La línea 16 ya está configurada:
   ```javascript
   const API_ENDPOINT = 'http://localhost:8000/api/contacts';
   ```

### Paso 2: Actualizar la URL en el panel de administración

1. Abre el archivo `/admin/js/config.js`
2. Verifica que tenga:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

### Paso 3: Abrir el sitio web

Puedes usar cualquiera de estos métodos:

**Opción A: Usar Live Server (recomendado)**
1. Instala la extensión "Live Server" en VS Code
2. Click derecho en `index.html` → "Open with Live Server"
3. Se abrirá en `http://127.0.0.1:5500`

**Opción B: Usar Python**
```bash
# En la carpeta raíz del proyecto (NO en backend)
python -m http.server 3000
```
Abre `http://localhost:3000`

**Opción C: Abrir directamente**
- Doble click en `index.html`
- (Algunas funciones pueden no funcionar)

## 🎯 Primer Inicio

### 1. Verificar que todo funciona

1. **Backend funcionando:**
   - Abre: http://localhost:8000/health
   - Debe responder: `{"status": "ok"}`

2. **Documentación API:**
   - Abre: http://localhost:8000/api/docs
   - Verás la interfaz Swagger

3. **Sitio web funcionando:**
   - Abre tu sitio (ej: http://localhost:3000)
   - Navega a la página de contacto
   - Prueba enviar un mensaje

### 2. Acceder al Panel de Administración

1. Abre: `http://localhost:3000/admin/login.html`
   (Ajusta el puerto según tu servidor)

2. Inicia sesión con:
   - **Email:** El que configuraste en `.env`
   - **Password:** El que configuraste en `.env`

3. Explora las secciones:
   - **Dashboard:** Vista general
   - **Artículos:** Crear y gestionar posts del blog
   - **Contactos:** Ver mensajes del formulario

## 📝 Uso del Panel de Administración

### Crear tu primer artículo

1. Ve a **Artículos** en el menú lateral
2. Click en **+ Nuevo Artículo**
3. Rellena los campos:
   - **Título:** "Mi primer artículo de prueba"
   - **Descripción:** Un resumen breve
   - **Contenido:** El texto completo (puedes usar HTML)
   - **Imagen destacada:** URL de una imagen (opcional)
   - **Meta tags:** Para SEO (opcional pero recomendado)
4. Marca "Publicar artículo" si quieres que sea visible
5. Click en **Guardar**

### Ver mensajes de contacto

1. Ve a **Contactos** en el menú
2. Verás todos los mensajes recibidos
3. Click en uno para ver detalles completos
4. Puedes marcarlo como "Respondido" o eliminarlo

## 🔄 Flujo de Trabajo Diario

### Iniciar el sistema

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   python run.py
   ```

2. **Terminal 2 - Frontend (opcional):**
   ```bash
   python -m http.server 3000
   # O usa Live Server en VS Code
   ```

### Gestionar contenido

1. Abre el panel admin: `http://localhost:3000/admin/`
2. Crea/edita artículos según necesites
3. Revisa mensajes de contacto regularmente

### Detener el sistema

- Presiona `Ctrl + C` en las terminales donde corre el servidor

## 🚨 Solución de Problemas

### El backend no inicia

```bash
# Asegúrate de estar en el entorno virtual
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate

# Reinstala dependencias
pip install -r requirements.txt

# Intenta de nuevo
python run.py
```

### Error "No se pudo conectar a la API"

1. Verifica que el backend esté corriendo (terminal 1)
2. Verifica la URL en `/admin/js/config.js`
3. Comprueba que no haya firewall bloqueando el puerto 8000

### Error "Unauthorized" al hacer login

1. Verifica las credenciales en el archivo `.env`
2. Reinicia el servidor backend
3. Limpia las cookies del navegador

### CORS Error

1. Abre `/backend/.env`
2. Añade tu dominio a `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:5500
   ```
3. Reinicia el backend

### No aparecen los artículos en el sitio web

Los artículos del panel admin son solo para el backend. Para que aparezcan en tu sitio web HTML necesitas:

1. **Opción A:** Crear un script que genere HTML estático desde la API
2. **Opción B:** Usar JavaScript para cargar artículos dinámicamente
3. **Opción C:** Migrar a un framework como React/Vue

## 📞 ¿Necesitas Ayuda?

Si encuentras problemas:

1. **Revisa los logs:** Los errores aparecen en la terminal donde corre el backend
2. **Documentación API:** http://localhost:8000/api/docs
3. **Verifica la configuración:** Revisa el archivo `.env`

## ✅ Checklist Final

- [ ] Backend corriendo en puerto 8000
- [ ] Frontend accesible en tu navegador
- [ ] Puedes hacer login en `/admin/login.html`
- [ ] Puedes crear artículos
- [ ] El formulario de contacto funciona
- [ ] Los mensajes llegan al panel admin

¡Si todo está marcado, tu sistema está completamente operativo! 🎉
