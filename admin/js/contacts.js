// Contacts page logic
if (!requireAuth()) {
    throw new Error('Not authenticated');
}

let currentContactId = null;
let currentUnreadFilter = false;

// Load contacts
async function loadContacts(unreadOnly = false) {
    currentUnreadFilter = unreadOnly;

    // Update button states
    document.getElementById('btnAll').classList.toggle('btn-primary', !unreadOnly);
    document.getElementById('btnAll').classList.toggle('btn-secondary', unreadOnly);
    document.getElementById('btnUnread').classList.toggle('btn-primary', unreadOnly);
    document.getElementById('btnUnread').classList.toggle('btn-secondary', !unreadOnly);

    const container = document.getElementById('contactsList');
    container.innerHTML = '<div class="loading">Cargando mensajes...</div>';

    try {
        const contacts = await ContactsAPI.getAll(unreadOnly);

        if (contacts.length === 0) {
            container.innerHTML = '<div class="loading">No hay mensajes</div>';
            return;
        }

        container.innerHTML = contacts.map(contact => `
            <div class="contact-item ${!contact.read ? 'unread' : ''}" onclick="viewContact(${contact.id})">
                <div class="contact-header">
                    <div class="contact-name">
                        ${!contact.read ? '🔴 ' : ''}${contact.name}
                        ${contact.replied ? ' ✅' : ''}
                    </div>
                    <div class="contact-date">
                        ${new Date(contact.created_at).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
                <div class="contact-subject">${contact.subject || 'Sin asunto'}</div>
                <div class="contact-preview">${contact.message}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading contacts:', error);
        container.innerHTML = '<div class="loading">Error al cargar mensajes</div>';
    }
}

// View contact
async function viewContact(id) {
    try {
        const contact = await ContactsAPI.getById(id);
        currentContactId = id;

        document.getElementById('contactName').textContent = contact.name;
        document.getElementById('contactEmail').textContent = contact.email;
        document.getElementById('contactEmail').href = `mailto:${contact.email}`;
        document.getElementById('contactPhone').textContent = contact.phone || 'No especificado';
        document.getElementById('contactSubject').textContent = contact.subject || 'Sin asunto';
        document.getElementById('contactMessage').textContent = contact.message;
        document.getElementById('contactDate').textContent = new Date(contact.created_at).toLocaleString('es-ES');

        // Update button states
        if (contact.replied) {
            document.getElementById('btnReplied').style.display = 'none';
        } else {
            document.getElementById('btnReplied').style.display = 'inline-block';
        }

        document.getElementById('contactModal').style.display = 'flex';

        // Mark as read if unread
        if (!contact.read) {
            await ContactsAPI.markAsRead(id);
            loadContacts(currentUnreadFilter);
        }
    } catch (error) {
        alert('Error al cargar el mensaje: ' + error.message);
    }
}

// Mark as replied
async function markAsReplied() {
    if (!currentContactId) return;

    try {
        await ContactsAPI.markAsReplied(currentContactId);
        closeContactModal();
        loadContacts(currentUnreadFilter);
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Delete contact
async function deleteContact() {
    if (!currentContactId) return;

    if (!confirm('¿Estás seguro de eliminar este mensaje?')) {
        return;
    }

    try {
        await ContactsAPI.delete(currentContactId);
        closeContactModal();
        loadContacts(currentUnreadFilter);
    } catch (error) {
        alert('Error al eliminar: ' + error.message);
    }
}

// Close modal
function closeContactModal() {
    document.getElementById('contactModal').style.display = 'none';
    currentContactId = null;
}

// Initialize
loadContacts(false);
