/**
 * Contact Form Handler
 * Gestiona el envío del formulario de contacto con validación y feedback
 */
(function() {
    'use strict';

    // Elementos del DOM
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Configuración
    const API_ENDPOINT = 'http://localhost:8000/api/contacts';
    const HONEYPOT_FIELD = 'website';

    /**
     * Validación de campos del formulario
     */
    const validators = {
        nombre: (value) => {
            if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
            if (value.length > 100) return 'El nombre no puede exceder 100 caracteres';
            return null;
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return 'Por favor, introduce un email válido';
            return null;
        },
        telefono: (value) => {
            if (!value) return null; // Campo opcional
            const phoneRegex = /^[0-9+\-\s]+$/;
            if (!phoneRegex.test(value)) return 'El teléfono solo puede contener números, espacios y guiones';
            return null;
        },
        mensaje: (value) => {
            if (value.length < 10) return 'El mensaje debe tener al menos 10 caracteres';
            if (value.length > 1000) return 'El mensaje no puede exceder 1000 caracteres';
            return null;
        },
        consentimiento: (checked) => {
            if (!checked) return 'Debes aceptar la política de privacidad';
            return null;
        }
    };

    /**
     * Muestra error en un campo específico
     */
    function showFieldError(field, message) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('error');
        }
    }

    /**
     * Limpia el error de un campo
     */
    function clearFieldError(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            field.setAttribute('aria-invalid', 'false');
            field.classList.remove('error');
        }
    }

    /**
     * Valida todo el formulario
     */
    function validateForm() {
        let isValid = true;
        
        // Validar cada campo
        Object.keys(validators).forEach(fieldName => {
            const field = form.elements[fieldName];
            if (!field) return;
            
            const value = field.type === 'checkbox' ? field.checked : field.value.trim();
            const error = validators[fieldName](value);
            
            if (error) {
                showFieldError(field, error);
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        return isValid;
    }

    /**
     * Muestra el estado del formulario
     */
    function showStatus(message, type = 'info') {
        formStatus.className = `form-status form-status-${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        // Scroll suave al mensaje
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Focus para lectores de pantalla
        formStatus.focus();
    }

    /**
     * Limpia el estado del formulario
     */
    function clearStatus() {
        formStatus.style.display = 'none';
        formStatus.textContent = '';
    }

    /**
     * Activa/desactiva el estado de carga
     */
    function setLoadingState(isLoading) {
        submitBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'inline';
        btnLoading.style.display = isLoading ? 'inline' : 'none';
        
        if (isLoading) {
            submitBtn.setAttribute('aria-busy', 'true');
        } else {
            submitBtn.removeAttribute('aria-busy');
        }
    }

    /**
     * Envía el formulario
     */
    async function submitForm(formData) {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            throw error;
        }
    }

    /**
     * Validación en tiempo real
     */
    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('blur', function() {
            const fieldName = this.name;
            if (validators[fieldName]) {
                const value = this.type === 'checkbox' ? this.checked : this.value.trim();
                const error = validators[fieldName](value);
                
                if (error) {
                    showFieldError(this, error);
                } else {
                    clearFieldError(this);
                }
            }
        });
    });

    /**
     * Manejo del envío del formulario
     */
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Limpiar estado anterior
        clearStatus();
        
        // Verificar honeypot
        const honeypot = form.elements[HONEYPOT_FIELD];
        if (honeypot && honeypot.value) {
            console.warn('Honeypot triggered');
            return;
        }
        
        // Validar formulario
        if (!validateForm()) {
            showStatus('Por favor, corrige los errores en el formulario', 'error');
            return;
        }
        
        // Preparar datos (formato adaptado a la API)
        const formData = {
            name: form.elements.nombre.value.trim(),
            email: form.elements.email.value.trim(),
            phone: form.elements.telefono.value.trim(),
            subject: form.elements.asunto.value,
            message: form.elements.mensaje.value.trim()
        };
        
        // Activar estado de carga
        setLoadingState(true);
        showStatus('Enviando tu mensaje...', 'info');
        
        try {
            // Enviar formulario
            const result = await submitForm(formData);
            
            // Éxito
            showStatus('¡Mensaje enviado con éxito! Te contactaré en menos de 24 horas.', 'success');
            
            // Limpiar formulario
            form.reset();
            
            // Tracking (si tienes Google Analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': formData.asunto || 'General'
                });
            }
            
        } catch (error) {
            // Error
            showStatus('Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo o contacta directamente por teléfono.', 'error');
            
            // Log para debugging (quitar en producción)
            console.error('Error de envío:', error);
            
        } finally {
            // Desactivar estado de carga
            setLoadingState(false);
        }
    });

    // Estilos CSS adicionales para los estados
    const styles = document.createElement('style');
    styles.textContent = `
        .form-input.error {
            border-color: #ef4444;
        }
        
        .error-message {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
        }
        
        .form-status {
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
            display: none;
            font-weight: 500;
        }
        
        .form-status-info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #93c5fd;
        }
        
        .form-status-success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
        }
        
        .form-status-error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        
        .checkbox-label {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
        }
        
        .checkbox-label input[type="checkbox"] {
            margin-top: 0.25rem;
        }
        
        .btn-loading {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        button[disabled] {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(styles);

})();