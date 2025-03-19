// Esperar a que se cargue completamente el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling - Contacto principal
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone')?.value || '';
            const subject = document.getElementById('subject')?.value || '';
            const message = document.getElementById('message').value;
            
            // Form validation
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu nombre.\n';
                document.getElementById('name').classList.add('error');
            } else {
                document.getElementById('name').classList.remove('error');
            }
            
            if (!email) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu email.\n';
                document.getElementById('email').classList.add('error');
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Por favor, introduce un email válido.\n';
                document.getElementById('email').classList.add('error');
            } else {
                document.getElementById('email').classList.remove('error');
            }
            
            if (!message) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu mensaje.\n';
                document.getElementById('message').classList.add('error');
            } else {
                document.getElementById('message').classList.remove('error');
            }
            
            if (!isValid) {
                showToast(errorMessage, 'error');
                return;
            }
            
            // Simulación de envío del formulario
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular delay de envío
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                showToast(`Gracias ${name} por tu mensaje. Te contactaré pronto.`, 'success');
                contactForm.reset();
            }, 1500);
        });
    }

    // Form submission handling - Formulario extendido de contacto
    const contactFormExtended = document.getElementById('contactFormExtended');
    if (contactFormExtended) {
        contactFormExtended.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone')?.value || '';
            const company = document.getElementById('company')?.value || '';
            const service = document.getElementById('service')?.value || '';
            const message = document.getElementById('message').value;
            const privacy = document.getElementById('privacy').checked;
            
            // Form validation
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu nombre.\n';
                document.getElementById('name').classList.add('error');
            } else {
                document.getElementById('name').classList.remove('error');
            }
            
            if (!email) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu email.\n';
                document.getElementById('email').classList.add('error');
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Por favor, introduce un email válido.\n';
                document.getElementById('email').classList.add('error');
            } else {
                document.getElementById('email').classList.remove('error');
            }
            
            if (!message) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu mensaje.\n';
                document.getElementById('message').classList.add('error');
            } else {
                document.getElementById('message').classList.remove('error');
            }
            
            if (!privacy) {
                isValid = false;
                errorMessage += 'Debes aceptar la política de privacidad.\n';
                document.getElementById('privacy').parentElement.classList.add('error');
            } else {
                document.getElementById('privacy').parentElement.classList.remove('error');
            }
            
            if (!isValid) {
                showToast(errorMessage, 'error');
                return;
            }
            
            // Simulación de envío del formulario
            const submitButton = contactFormExtended.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular delay de envío
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                showToast(`Gracias ${name} por tu mensaje. Te contactaré pronto para hablar sobre "${service}".`, 'success');
                contactFormExtended.reset();
            }, 1500);
        });
    }

    // Form submission handling - Formulario de comentarios
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('comment-name').value;
            const email = document.getElementById('comment-email').value;
            const text = document.getElementById('comment-text').value;
            
            // Form validation
            let isValid = true;
            let errorMessage = '';
            
            if (!name) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu nombre.\n';
                document.getElementById('comment-name').classList.add('error');
            } else {
                document.getElementById('comment-name').classList.remove('error');
            }
            
            if (!email) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu email.\n';
                document.getElementById('comment-email').classList.add('error');
            } else if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Por favor, introduce un email válido.\n';
                document.getElementById('comment-email').classList.add('error');
            } else {
                document.getElementById('comment-email').classList.remove('error');
            }
            
            if (!text) {
                isValid = false;
                errorMessage += 'Por favor, introduce tu comentario.\n';
                document.getElementById('comment-text').classList.add('error');
            } else {
                document.getElementById('comment-text').classList.remove('error');
            }
            
            if (!isValid) {
                showToast(errorMessage, 'error');
                return;
            }
            
            // Simulación de envío del formulario
            const submitButton = commentForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simular delay de envío
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                showToast(`¡Gracias ${name}! Tu comentario ha sido enviado y será revisado antes de ser publicado.`, 'success');
                commentForm.reset();
            }, 1500);
        });
    }

    // Suscripción a newsletter
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            if (!email || !isValidEmail(email)) {
                showToast('Por favor, introduce un email válido.', 'error');
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Procesando...';
            
            // Simular delay de envío
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                
                showToast(`¡Gracias por suscribirte! Recibirás pronto contenido exclusivo en ${email}.`, 'success');
                this.reset();
            }, 1500);
        });
    }

    // Form submission handling - Búsqueda en blog
    const blogSearchForm = document.querySelector('.blog-search-form');
    if (blogSearchForm) {
        blogSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchQuery = this.querySelector('.blog-search-input').value;
            
            if (!searchQuery) {
                showToast('Por favor, introduce un término de búsqueda.', 'error');
                return;
            }
            
            showToast(`Búsqueda realizada con éxito para: "${searchQuery}"`, 'success');
            // Aquí iría la funcionalidad real de búsqueda
        });
    }

    // Botones de categoría del blog
    const blogCategories = document.querySelectorAll('.blog-category');
    if (blogCategories.length > 0) {
        blogCategories.forEach(category => {
            category.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remover clase activa de todas las categorías
                blogCategories.forEach(cat => cat.classList.remove('active'));
                
                // Añadir clase activa a la categoría clickeada
                this.classList.add('active');
                
                const categoryName = this.textContent;
                showToast(`Categoría seleccionada: ${categoryName}`, 'info');
                // Aquí iría la funcionalidad real de filtrado por categoría
            });
        });
    }

    // Botones de paginación
    const paginationButtons = document.querySelectorAll('.pagination-number, .pagination-arrow');
    if (paginationButtons.length > 0) {
        paginationButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (this.classList.contains('disabled')) {
                    return;
                }
                
                // Remover clase activa de todos los números de página
                document.querySelectorAll('.pagination-number').forEach(num => {
                    num.classList.remove('active');
                });
                
                // Si es un número de página, activarlo
                if (this.classList.contains('pagination-number')) {
                    this.classList.add('active');
                    showToast(`Página ${this.textContent} seleccionada`, 'info');
                } else {
                    // Si es una flecha, mostrar mensaje adecuado
                    const direction = this.textContent === '←' ? 'anterior' : 'siguiente';
                    showToast(`Navegando a la página ${direction}`, 'info');
                }
                
                // Aquí iría la funcionalidad real de paginación
            });
        });
    }

    // Botones de compartir artículo
    const shareButtons = document.querySelectorAll('.share-button');
    if (shareButtons.length > 0) {
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const platform = this.textContent;
                showToast(`Compartiendo artículo en ${platform}`, 'success');
                // Aquí iría la funcionalidad real de compartir
            });
        });
    }

    // Botones de responder a comentarios
    const replyButtons = document.querySelectorAll('.reply-button');
    if (replyButtons.length > 0) {
        replyButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const commentAuthor = this.closest('.comment').querySelector('.comment-author-info h4').textContent;
                showToast(`Respondiendo a ${commentAuthor}`, 'info');
                
                // Scroll al formulario de comentarios
                const commentForm = document.getElementById('commentForm');
                if (commentForm) {
                    // Añadir mención al comentario
                    const commentText = document.getElementById('comment-text');
                    commentText.value = `@${commentAuthor}: `;
                    commentText.focus();
                    
                    // Scroll al formulario
                    commentForm.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Funcionalidad de FAQ (acordeón)
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', function() {
                // Cerrar otros elementos abiertos (opcional)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle actual elemento
                item.classList.toggle('active');
            });
        });
    }

    // Slider de testimonios
    const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
    if (testimonialDots.length > 0) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                // Remover clase activa de todos los dots
                testimonialDots.forEach(d => d.classList.remove('active'));
                
                // Activar el dot clickeado
                this.classList.add('active');
                
                // Mover el slider
                const slider = document.querySelector('.testimonials-slider');
                if (slider) {
                    slider.style.transform = `translateX(-${index * 100}%)`;
                }
            });
        });
        
        // Auto-rotación del carrusel
        let currentSlide = 0;
        const totalSlides = testimonialDots.length;
        
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            
            // Actualizar dots
            testimonialDots.forEach(d => d.classList.remove('active'));
            testimonialDots[currentSlide].classList.add('active');
            
            // Mover slider
            const slider = document.querySelector('.testimonials-slider');
            if (slider) {
                slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
        }, 5000); // Cambiar cada 5 segundos
    }

    // Validación de email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Animación de elementos al hacer scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                element.classList.add('animate');
            }
        });
    };

    // Aplicar clase para animación a elementos existentes
    const serviciosCards = document.querySelectorAll('.service-card');
    serviciosCards.forEach(card => {
        card.classList.add('animate-on-scroll');
    });

    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('animate-on-scroll');
    });

    // Contador de estadísticas
    function startCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = Math.trunc(target / speed);

            if (count < target) {
                counter.innerText = count + increment;
                setTimeout(() => startCounters(), 1);
            } else {
                counter.innerText = target;
            }
        });
    }

    // Crear y mostrar toast notifications
    function showToast(message, type = 'info') {
        // Crear elemento toast si no existe
        if (!document.querySelector('.toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Crear nuevo toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Agregar al contenedor
        document.querySelector('.toast-container').appendChild(toast);

        // Mostrar con animación
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Eliminar después de 5 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }

    // Agregar efecto parallax al hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPositionY = `calc(50% + ${scrollPosition * 0.5}px)`;
        });
    }

    // Cambiar color de header al hacer scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // Efecto de luz en botones
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            button.style.setProperty('--x', `${x}px`);
            button.style.setProperty('--y', `${y}px`);
        });
    });

    // Iniciar animaciones
    window.addEventListener('scroll', animateOnScroll);
    // Ejecutar las funciones iniciales
    animateOnScroll();
    
    // Si hay contadores en la página, iniciarlos
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        // Iniciar los contadores cuando sean visibles
        const counterSection = document.querySelector('.stats-section');
        if (counterSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(counterSection);
        } else {
            startCounters();
        }
    }
});

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('preloader-finish');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});