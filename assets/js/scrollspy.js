/**
 * scrollspy.js - Navbar sticky, sección activa y smooth scroll
 * @author Luis Romera Web
 * @description Gestión inteligente del header y navegación
 */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        stickyClass: 'is-scrolled',
        activeClass: 'is-active',
        headerOffset: 80, // Altura del header para compensar
        scrollThreshold: 50,
        smoothDuration: 800
    };

    // Cache de elementos
    let header = null;
    let navLinks = [];
    let sections = [];
    let isScrolling = false;

    /**
     * Inicialización
     */
    function init() {
        header = document.querySelector('.header, header');
        if (!header) return;

        setupStickyHeader();
        setupScrollSpy();
        setupSmoothScroll();
    }

    /**
     * Header sticky con clase al scrollear
     */
    function setupStickyHeader() {
        let lastScroll = 0;
        
        const handleScroll = throttle(() => {
            const currentScroll = window.pageYOffset;
            
            // Añadir/quitar clase según scroll
            if (currentScroll > CONFIG.scrollThreshold) {
                header.classList.add(CONFIG.stickyClass);
                
                // Opcional: ocultar al bajar, mostrar al subir
                if (currentScroll > lastScroll && currentScroll > 300) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.classList.remove(CONFIG.stickyClass);
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        }, 10);

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Estado inicial
        handleScroll();
    }

    /**
     * ScrollSpy - Resaltar link activo según sección visible
     */
    function setupScrollSpy() {
        // Obtener links y secciones
        navLinks = document.querySelectorAll('.nav-link[href^="#"], .nav-links a[href^="#"]');
        const sectionIds = Array.from(navLinks).map(link => 
            link.getAttribute('href').substring(1)
        ).filter(id => id);
        
        sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
        
        if (sections.length === 0) return;

        // Configurar IntersectionObserver
        const observerOptions = {
            rootMargin: `-${CONFIG.headerOffset}px 0px -50% 0px`,
            threshold: [0, 0.25, 0.5, 0.75, 1]
        };

        const observer = new IntersectionObserver(handleSectionIntersection, observerOptions);
        
        sections.forEach(section => observer.observe(section));
        
        // También escuchar scroll para casos edge
        window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });
    }

    /**
     * Callback para IntersectionObserver de secciones
     */
    function handleSectionIntersection(entries) {
        if (isScrolling) return; // No actualizar durante smooth scroll
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
                updateActiveLink(entry.target.id);
            }
        });
    }

    /**
     * Actualizar link activo en navegación
     */
    function updateActiveLink(sectionId) {
        // Si es string, es un ID directo
        if (typeof sectionId === 'string') {
            navLinks.forEach(link => {
                link.classList.remove(CONFIG.activeClass, 'active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add(CONFIG.activeClass, 'active');
                }
            });
            return;
        }
        
        // Si no, calcular sección actual por scroll position
        const scrollPosition = window.pageYOffset + CONFIG.headerOffset + 100;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && section.offsetTop <= scrollPosition) {
                updateActiveLink(section.id);
                break;
            }
        }
    }

    /**
     * Smooth scroll para anchors
     */
    function setupSmoothScroll() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const targetId = link.getAttribute('href').substring(1);
            if (!targetId) return;
            
            const targetElement = document.getElementById(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            smoothScrollTo(targetElement);
        });
    }

    /**
     * Función de smooth scroll con compensación de header
     */
    function smoothScrollTo(element) {
        isScrolling = true;
        
        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - CONFIG.headerOffset;
        
        // Usar API nativa si está disponible
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Reset flag después de animación estimada
            setTimeout(() => {
                isScrolling = false;
                updateActiveLink();
            }, CONFIG.smoothDuration);
        } else {
            // Fallback animado
            animateScroll(offsetPosition, CONFIG.smoothDuration);
        }
    }

    /**
     * Animación de scroll manual (fallback)
     */
    function animateScroll(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function
            const ease = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                isScrolling = false;
                updateActiveLink();
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Throttle utility
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();