// Dashboard page logic
if (!requireAuth()) {
    throw new Error('Not authenticated');
}

// Load user info
async function loadUserInfo() {
    try {
        const user = await AuthAPI.getCurrentUser();
        document.getElementById('userEmail').textContent = user.email;
    } catch (error) {
        console.error('Error loading user:', error);
    }
}

// Load dashboard stats
async function loadStats() {
    try {
        const [articles, contacts] = await Promise.all([
            ArticlesAPI.getAll(true),
            ContactsAPI.getAll(false)
        ]);

        const publishedArticles = articles.filter(a => a.published).length;
        const unreadContacts = contacts.filter(c => !c.read).length;

        document.getElementById('totalArticles').textContent = articles.length;
        document.getElementById('publishedArticles').textContent = publishedArticles;
        document.getElementById('totalContacts').textContent = contacts.length;
        document.getElementById('unreadContacts').textContent = unreadContacts;

        // Load recent items
        loadRecentArticles(articles.slice(0, 5));
        loadRecentContacts(contacts.slice(0, 5));
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function loadRecentArticles(articles) {
    const container = document.getElementById('recentArticles');

    if (articles.length === 0) {
        container.innerHTML = '<div class="data-item">No hay artículos</div>';
        return;
    }

    container.innerHTML = articles.map(article => `
        <div class="data-item">
            <div class="data-item-title">${article.title}</div>
            <div class="data-item-meta">
                ${article.published ? '✅ Publicado' : '⏳ Borrador'} •
                ${article.views} vistas •
                ${new Date(article.created_at).toLocaleDateString('es-ES')}
            </div>
        </div>
    `).join('');
}

function loadRecentContacts(contacts) {
    const container = document.getElementById('recentContacts');

    if (contacts.length === 0) {
        container.innerHTML = '<div class="data-item">No hay mensajes</div>';
        return;
    }

    container.innerHTML = contacts.map(contact => `
        <div class="data-item">
            <div class="data-item-title">
                ${contact.read ? '' : '🔴 '}${contact.name}
            </div>
            <div class="data-item-meta">
                ${contact.subject || 'Sin asunto'} •
                ${new Date(contact.created_at).toLocaleDateString('es-ES')}
            </div>
        </div>
    `).join('');
}

// Initialize
loadUserInfo();
loadStats();
