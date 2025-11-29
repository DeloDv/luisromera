// Articles page logic
if (!requireAuth()) {
    throw new Error('Not authenticated');
}

let currentArticleId = null;

// Load articles
async function loadArticles() {
    const container = document.getElementById('articlesList');
    container.innerHTML = '<div class="loading">Cargando artículos...</div>';

    try {
        const articles = await ArticlesAPI.getAll(true);

        if (articles.length === 0) {
            container.innerHTML = '<div class="loading">No hay artículos</div>';
            return;
        }

        container.innerHTML = articles.map(article => `
            <div class="article-item">
                <div class="article-info">
                    <div class="article-title">${article.title}</div>
                    <div class="article-meta">
                        <span class="badge ${article.published ? 'badge-success' : 'badge-warning'}">
                            ${article.published ? 'Publicado' : 'Borrador'}
                        </span>
                        <span>👁 ${article.views} vistas</span>
                        <span>${new Date(article.created_at).toLocaleDateString('es-ES')}</span>
                    </div>
                    ${article.description ? `<div class="article-description">${article.description}</div>` : ''}
                </div>
                <div class="article-actions">
                    <button class="btn btn-secondary" onclick="editArticle(${article.id})">
                        Editar
                    </button>
                    <button class="btn btn-danger" onclick="deleteArticle(${article.id})">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading articles:', error);
        container.innerHTML = '<div class="loading">Error al cargar artículos</div>';
    }
}

// Show create modal
function showCreateModal() {
    currentArticleId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo Artículo';
    document.getElementById('articleForm').reset();
    document.getElementById('articleId').value = '';
    document.getElementById('articleModal').style.display = 'flex';
}

// Edit article
async function editArticle(id) {
    try {
        const article = await ArticlesAPI.getById(id);

        currentArticleId = id;
        document.getElementById('modalTitle').textContent = 'Editar Artículo';
        document.getElementById('articleId').value = id;
        document.getElementById('title').value = article.title;
        document.getElementById('description').value = article.description || '';
        document.getElementById('content').value = article.content;
        document.getElementById('featured_image').value = article.featured_image || '';
        document.getElementById('meta_title').value = article.meta_title || '';
        document.getElementById('meta_description').value = article.meta_description || '';
        document.getElementById('meta_keywords').value = article.meta_keywords || '';
        document.getElementById('published').checked = article.published;

        document.getElementById('articleModal').style.display = 'flex';
    } catch (error) {
        alert('Error al cargar el artículo: ' + error.message);
    }
}

// Delete article
async function deleteArticle(id) {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) {
        return;
    }

    try {
        await ArticlesAPI.delete(id);
        loadArticles();
    } catch (error) {
        alert('Error al eliminar artículo: ' + error.message);
    }
}

// Close modal
function closeModal() {
    document.getElementById('articleModal').style.display = 'none';
    document.getElementById('formError').style.display = 'none';
}

// Form submit
document.getElementById('articleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const errorDiv = document.getElementById('formError');

    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    errorDiv.style.display = 'none';

    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value || null,
        content: document.getElementById('content').value,
        featured_image: document.getElementById('featured_image').value || null,
        meta_title: document.getElementById('meta_title').value || null,
        meta_description: document.getElementById('meta_description').value || null,
        meta_keywords: document.getElementById('meta_keywords').value || null,
        published: document.getElementById('published').checked,
    };

    try {
        if (currentArticleId) {
            await ArticlesAPI.update(currentArticleId, data);
        } else {
            await ArticlesAPI.create(data);
        }

        closeModal();
        loadArticles();
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
});

// Initialize
loadArticles();
