/**
 * backtotop.js - Botón para volver arriba
 * @author Luis Romera Web
 * @description Botón accesible con aparición progresiva
 */

(function() {
    'use strict';

    const CONFIG = {
        showThreshold: 0.5, // 50% del scroll
        animationDuration: 500,
        buttonHTML: `
            <button class="back-to-top" aria-label="Volver arriba" hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </button>
        `
    };

    let button = null;
    let isVisible = false;

    /**
     * Inicialización
     */
    function init() {
        createButton();
        attachEvents();
    }

    /**
     * Crear botón
     */
    function createButton() {
        // Insertar HTML del botón
        document.body.insertAdjacentHTML('beforeend', CONFIG.buttonHTML);
        button = document.querySelector('.back-to-top');
    }

    /**
     * Adjuntar eventos
     */
    function attachEvents() {
        // Scroll listener
        window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
        
        // Click listener
        button.addEventListener('click', scrollToTop);
        
        // Keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
    }

    /**
     * Manejar scroll
     */
    function handleScroll() {
        const scrollPercentage = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        
        if (scrollPercentage > CONFIG.showThreshold && !isVisible) {
            showButton();
        } else if (scrollPercentage <= CONFIG.showThreshold && isVisible) {
            hideButton();
        }
    }

    /**
     * Mostrar botón
     */
    function showButton() {
        isVisible = true;
        button.hidden = false;
        requestAnimationFrame(() => {
            button.classList.add('is-visible');
        });
    }

    /**
     * Ocultar botón
     */
    function hideButton() {
        isVisible = false;
        button.classList.remove('is-visible');
        setTimeout(() => {
            button.hidden = true;
        }, 300);
    }

    /**
     * Scroll to top
     */
    function scrollToTop() {
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            animateScrollToTop();
        }
    }

    /**
     * Animación manual de scroll
     */
    function animateScrollToTop() {
        const startPosition = window.pageYOffset;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / CONFIG.animationDuration, 1);
            
            // Easing
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
            
            window.scrollTo(0, startPosition * (1 - ease));
            
            if (progress < 1) {
                requestAnimationFrame(animation);
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