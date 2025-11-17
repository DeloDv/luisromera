// Article detail page - Load single article from API
const API_URL = 'http://localhost:8000/api';

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cargar artículo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadArticle);

async function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    
    console.log('Loading article with slug:', slug);
    
    if (!slug) {
        document.querySelector('.article-header .container').innerHTML = '<p class="loading">No se especificó artículo</p>';
        return;
    }

    try {
        const res = await fetch(`${API_URL}/articles/slug/${slug}`);
        
        if (!res.ok) {
            throw new Error('Error al cargar el artículo');
        }
        
        const article = await res.json();
        
        console.log('Article loaded:', article);
        
        // Actualizar título de la página
        document.title = article.title + ' - Luis Romera';
        
        // Mostrar el artículo
        displayArticle(article);
        
    } catch (error) {
        console.error('Error loading article:', error);
        document.querySelector('.article-header .container').innerHTML = '<p class="loading">Error al cargar</p>';
    }
}

function displayArticle(article) {
    // Formatear fecha
    const date = new Date(article.created_at).toLocaleDateString('es-ES', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
    
    // Calcular tiempo de lectura
    const wordCount = (article.content || '').split(/\s+/).filter(w => w).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 250));
    
    // Actualizar header del artículo
    document.querySelector('.article-header .container').innerHTML = `
        <div class="article-breadcrumb">
            <a href="index.html">Inicio</a> › <a href="blog.html">Blog</a> › ${escapeHtml(article.title)}
        </div>
        <h1 class="article-title">${escapeHtml(article.title)}</h1>
        ${article.description ? `<p class="article-subtitle">${escapeHtml(article.description)}</p>` : ''}
        <div class="article-meta-info">
            <span>📅 ${date}</span>
            <span>⏱️ ${readTime} min</span>
            <span>👁️ ${article.views} vistas</span>
        </div>
    `;
    
    // Actualizar contenido del artículo
    document.querySelector('.article-body-content').innerHTML = article.content;
    
    // Generar tabla de contenidos
    generateTOC();
    
    // Configurar botones de compartir
    setupShare(article);
    
    // Cargar artículos relacionados
    loadRelated(article.id);
    
    // Incrementar vistas (llamada silenciosa)
    fetch(`${API_URL}/articles/${article.id}/view`, { method: 'POST' }).catch(() => {});
}

function generateTOC() {
    const headings = document.querySelectorAll('.article-body-content h2');
    const tocList = document.querySelector('.toc-list');
    
    if (headings.length === 0) {
        document.getElementById('tocWidget').style.display = 'none';
        return;
    }
    
    tocList.innerHTML = Array.from(headings).map((h, i) => {
        const id = `section-${i}`;
        h.id = id;
        return `<li><a href="#${id}" class="toc-link">${escapeHtml(h.textContent)}</a></li>`;
    }).join('');
    
    // Añadir smooth scroll a los enlaces
    document.querySelectorAll('.toc-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1);
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function setupShare(article) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    
    document.getElementById('shareButtons').innerHTML = `
        <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}" class="share-btn share-twitter" target="_blank">🐦 Twitter</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${url}" class="share-btn share-facebook" target="_blank">📘 Facebook</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}" class="share-btn share-linkedin" target="_blank">💼 LinkedIn</a>
        <a href="https://wa.me/?text=${title}%20${url}" class="share-btn share-whatsapp" target="_blank">💬 WhatsApp</a>
    `;
}

async function loadRelated(currentId) {
    try {
        const res = await fetch(`${API_URL}/articles?limit=4`);
        const articles = await res.json();
        const related = articles.filter(a => a.id !== currentId).slice(0, 3);
        
        if (related.length === 0) {
            document.getElementById('relatedWidget').style.display = 'none';
            return;
        }
        
        document.querySelector('.related-articles-list').innerHTML = related.map(a => {
            const date = new Date(a.created_at).toLocaleDateString('es-ES', {
                day: 'numeric', 
                month: 'short', 
                year: 'numeric'
            });
            return `
                <div class="related-article">
                    <div class="related-image-placeholder"></div>
                    <div class="related-content">
                        <h4 class="related-title">
                            <a href="articulo.html?slug=${a.slug}">${escapeHtml(a.title)}</a>
                        </h4>
                        <span class="related-date">${date}</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading related articles:', error);
        document.getElementById('relatedWidget').style.display = 'none';
    }
}