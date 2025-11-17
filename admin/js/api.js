// API utilities

async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
            }
        });

        if (response.status === 401) {
            // Unauthorized - redirect to login
            removeToken();
            window.location.href = 'login.html';
            return null;
        }

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Error desconocido' }));
            throw new Error(error.detail || 'Error en la petición');
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth API
const AuthAPI = {
    async login(email, password) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        return apiRequest(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        });
    },

    async getCurrentUser() {
        return apiRequest(API_ENDPOINTS.ME, {
            headers: getAuthHeaders()
        });
    },

    async getMe() {
        return this.getCurrentUser();
    }
};

// Articles API
const ArticlesAPI = {
    async getAll(adminMode = true) {
        const url = adminMode ? API_ENDPOINTS.ARTICLES_ADMIN : API_ENDPOINTS.ARTICLES;
        return apiRequest(url, {
            headers: getAuthHeaders()
        });
    },

    async getById(id) {
        return apiRequest(`${API_ENDPOINTS.ARTICLES}/${id}`, {
            headers: getAuthHeaders()
        });
    },

    async create(data) {
        return apiRequest(API_ENDPOINTS.ARTICLES, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },

    async update(id, data) {
        return apiRequest(`${API_ENDPOINTS.ARTICLES}/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
    },

    async delete(id) {
        return apiRequest(`${API_ENDPOINTS.ARTICLES}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    }
};

// Contacts API
const ContactsAPI = {
    async getAll(unreadOnly = false) {
        const url = unreadOnly
            ? `${API_ENDPOINTS.CONTACTS}?unread_only=true`
            : API_ENDPOINTS.CONTACTS;
        return apiRequest(url, {
            headers: getAuthHeaders()
        });
    },

    async getById(id) {
        return apiRequest(`${API_ENDPOINTS.CONTACTS}/${id}`, {
            headers: getAuthHeaders()
        });
    },

    async markAsRead(id) {
        return apiRequest(`${API_ENDPOINTS.CONTACTS}/${id}/read`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
    },

    async markAsReplied(id) {
        return apiRequest(`${API_ENDPOINTS.CONTACTS}/${id}/replied`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
    },

    async delete(id) {
        return apiRequest(`${API_ENDPOINTS.CONTACTS}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
    }
};