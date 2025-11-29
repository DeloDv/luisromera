// Blog page - Load articles from API
const API_BASE_URL = 'http://localhost:8000/api';

// Estado de la aplicación
let currentPage = 1;
let currentFilter = 'all';
const articlesPerPage = 6;
let allArticles = [];

// Cargar artículos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    setupFilters();
});

// Cargar artículos desde la API
async function loadArticles() {
    const container = document.getElementById('blogGrid');
    
    // Mostrar loading
    container.innerHTML = '<div class="loading-message">Cargando artículos...</div>';
    
    try {
        const response = await fetch(`${API_BASE_URL}/articles`);
        
        if (!response.ok) {
            throw new Error('Error al cargar artículos');
        }
        
        allArticles = await response.json();
        
        // Filtrar solo artículos publicados
        allArticles = allArticles.filter(article => article.published);
        
        if (allArticles.length === 0) {
            container.innerHTML = '<div class="no-articles">No hay artículos publicados todavía.</div>';
            return;
        }
        
        displayArticles();
        
    } catch (error) {
        console.error('Error loading articles:', error);
        container.innerHTML = '<div class="error-message">Error al cargar los artículos. Por favor, intenta más tarde.</div>';
    }
}

// Mostrar artículos en el grid
function displayArticles() {
    const container = document.getElementById('blogGrid');
    
    // Filtrar artículos según categoría actual
    let filteredArticles = allArticles;
    if (currentFilter !== 'all') {
        filteredArticles = allArticles.filter(article => {
            // Aquí podrías implementar filtrado por categoría si tu modelo lo soporta
            return true;
        });
    }
    
    // Paginación
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = filteredArticles.slice(startIndex, endIndex);
    
    if (articlesToShow.length === 0) {
        container.innerHTML = '<div class="no-articles">No hay artículos en esta categoría.</div>';
        return;
    }
    
    // Renderizar artículos
    container.innerHTML = articlesToShow.map(article => createArticleCard(article)).join('');
    
    // Actualizar paginación
    updatePagination(filteredArticles.length);
}

// Crear card de artículo
function createArticleCard(article) {
    const imageUrl = article.featured_image || 'https://via.placeholder.com/400x200/1a365d/ffffff?text=Blog';
    const date = new Date(article.created_at).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Extraer primer párrafo del contenido como excerpt si no hay description
    let excerpt = article.description;
    if (!excerpt && article.content) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = article.content;
        const firstP = tempDiv.querySelector('p');
        excerpt = firstP ? firstP.textContent.substring(0, 200) + '...' : '';
    }
    
    // Calcular tiempo de lectura aproximado (250 palabras por minuto)
    const wordCount = (article.content || '').split(/\s+/).filter(word => word.length > 0).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 250));
    
    return `
        <article class="blog-card">
            <img src="${imageUrl}" 
                 alt="${escapeHtml(article.title)}" 
                 class="blog-image"
                 onerror="this.src='https://via.placeholder.com/400x200/1a365d/ffffff?text=Blog'">
            <div class="blog-content">
                <span class="blog-category">Artículo</span>
                <h2 class="blog-post-title">
                    ${escapeHtml(article.title)}
                </h2>
                <div class="blog-meta">
                    <span class="blog-date">${date}</span>
                    <span class="blog-read-time">${readTime} min lectura</span>
                </div>
                <p class="blog-excerpt">
                    ${escapeHtml(excerpt || 'Sin descripción')}
                </p>
                <a href="articulo.html?slug=${article.slug}" class="blog-link">Leer más</a>
            </div>
        </article>
    `;
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Actualizar paginación
function updatePagination(totalArticles) {
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    let paginationHtml = '';
    
    // Botón anterior
    if (currentPage > 1) {
        paginationHtml += `<a href="#" class="page-btn" onclick="changePage(${currentPage - 1}); return false;">←</a>`;
    }
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHtml += `<a href="#" class="page-btn active">${i}</a>`;
        } else if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHtml += `<a href="#" class="page-btn" onclick="changePage(${i}); return false;">${i}</a>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHtml += `<span class="page-dots">...</span>`;
        }
    }
    
    // Botón siguiente
    if (currentPage < totalPages) {
        paginationHtml += `<a href="#" class="page-btn" onclick="changePage(${currentPage + 1}); return false;">→</a>`;
    }
    
    paginationContainer.innerHTML = paginationHtml;
}

// Cambiar página
function changePage(page) {
    currentPage = page;
    displayArticles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Configurar filtros
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover active de todos
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar active al clickeado
            btn.classList.add('active');
            
            // Obtener filtro
            currentFilter = btn.dataset.filter || 'all';
            
            // Resetear página
            currentPage = 1;
            
            // Mostrar artículos filtrados
            displayArticles();
        });
    });
}

// Estilos adicionales para mensajes
const styles = `
<style>
.loading-message, .error-message, .no-articles {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    font-size: 1.125rem;
    color: var(--text-light);
}

.error-message {
    color: #dc2626;
    background: #fee;
    border-radius: 0.5rem;
}

.page-dots {
    padding: 0 0.25rem;
    color: var(--text-light);
}
</style>
`;

// Inyectar estilos
document.head.insertAdjacentHTML('beforeend', styles);