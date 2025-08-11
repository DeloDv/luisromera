/**
 * effects.js - Efectos de revelado al scroll y parallax sutil
 * @author Luis Romera Web
 * @description Animaciones on-scroll con IntersectionObserver y respeto a prefers-reduced-motion
 */

(function() {
    'use strict';

    // Configuración
    const CONFIG = {
        revealOffset: 0.15, // 15% visible para activar
        parallaxSpeed: 0.5,
        animationClass: 'is-inview',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // Cache de elementos
    let revealElements = [];
    let parallaxElements = [];
    let rafId = null;
    let lastScrollY = 0;

    /**
     * Inicialización principal
     */
    function init() {
        if (CONFIG.reducedMotion) {
            console.log('Animaciones reducidas: prefers-reduced-motion activo');
            // Aplicar clase inmediatamente sin animación
            document.querySelectorAll('[data-reveal]').forEach(el => {
                el.classList.add('no-animation');
                el.classList.add(CONFIG.animationClass);
            });
            return;
        }

        setupRevealElements();
        setupParallax();
        setupReducedMotionListener();
    }

    /**
     * Configurar elementos con efecto reveal
     */
    function setupRevealElements() {
        revealElements = document.querySelectorAll('[data-reveal]');
        
        if (revealElements.length === 0) return;

        // Configurar IntersectionObserver
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: CONFIG.revealOffset
        };

        const observer = new IntersectionObserver(handleReveal, observerOptions);

        // Añadir delay opcional desde atributo data-delay
        revealElements.forEach((el, index) => {
            const delay = el.dataset.delay || index * 50;
            el.style.transitionDelay = `${delay}ms`;
            observer.observe(el);
        });
    }

    /**
     * Callback para IntersectionObserver
     */
    function handleReveal(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Añadir clase con pequeño retraso para suavidad
                requestAnimationFrame(() => {
                    entry.target.classList.add(CONFIG.animationClass);
                });
                
                // Dejar de observar una vez revelado (performance)
                if (entry.target.dataset.revealOnce !== 'false') {
                    observer.unobserve(entry.target);
                }
            } else if (entry.target.dataset.revealOnce === 'false') {
                // Permitir re-animación si se especifica
                entry.target.classList.remove(CONFIG.animationClass);
            }
        });
    }

    /**
     * Configurar efecto parallax sutil
     */
    function setupParallax() {
        parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0 || CONFIG.reducedMotion) return;
        
        // Solo activar en desktop
        if (window.innerWidth < 768) return;

        // Listener optimizado con passive
        window.addEventListener('scroll', throttle(updateParallax, 16), { passive: true });
        
        // Actualización inicial
        updateParallax();
    }

    /**
     * Actualizar posiciones parallax
     */
    function updateParallax() {
        lastScrollY = window.pageYOffset;
        
        if (!rafId) {
            rafId = requestAnimationFrame(() => {
                parallaxElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const speed = parseFloat(el.dataset.speed) || CONFIG.parallaxSpeed;
                    const yPos = -(lastScrollY * speed);
                    
                    // Solo actualizar si está en viewport
                    if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
                        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                    }
                });
                rafId = null;
            });
        }
    }

    /**
     * Escuchar cambios en prefers-reduced-motion
     */
    function setupReducedMotionListener() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        mediaQuery.addEventListener('change', (e) => {
            CONFIG.reducedMotion = e.matches;
            if (e.matches) {
                // Desactivar animaciones
                disableAnimations();
            } else {
                // Reactivar
                init();
            }
        });
    }

    /**
     * Desactivar todas las animaciones
     */
    function disableAnimations() {
        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.classList.add('no-animation', CONFIG.animationClass);
        });
        
        parallaxElements.forEach(el => {
            el.style.transform = 'none';
        });
        
        window.removeEventListener('scroll', updateParallax);
    }

    /**
     * Throttle para optimización
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

    // Inicializar cuando DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();