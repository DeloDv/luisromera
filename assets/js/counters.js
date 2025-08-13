/**
 * counters.js - Contadores animados on-view
 * @author Luis Romera Web
 * @description Animación de números al entrar en viewport
 */

(function () {
    'use strict';

    // VALORES FIJOS PARA TODA LA WEB
    const FIXED_VALUES = {
        'experiencia': 24,
        'roi-min': 5,
        'roi-max': 7,
        'roi-empresas': 86,
        'mejora-comercial': 30,
        'comerciales-formados': 200,
        'años-formacion': 5
    };

    const CONFIG = {
        duration: 2000,
        easing: 'easeOutQuart',
        once: true,
        prefix: '',
        suffix: '',
        separator: '.'
    };

    let counters = [];
    let animated = new WeakSet();

    /**
     * Inicialización
     */
    function init() {
        counters = document.querySelectorAll('[data-counter], .counter');
        if (counters.length === 0) return;

        setupObserver();
    }

    /**
     * Configurar IntersectionObserver
     */
    function setupObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        counters.forEach(counter => {
            // Guardar valor inicial
            const target = parseFloat(counter.dataset.target || counter.textContent);
            counter.dataset.target = target;
            counter.textContent = '0';

            observer.observe(counter);
        });
    }

    /**
     * Callback para IntersectionObserver
     */
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated.has(entry.target)) {
                animateCounter(entry.target);

                if (CONFIG.once) {
                    animated.add(entry.target);
                    observer.unobserve(entry.target);
                }
            }
        });
    }

    /**
     * Animar contador individual
     */
    // Modificación en counters.js para contadores en línea
    function animateCounter(element) {
        const fixedKey = element.dataset.fixedValue;
        const target = fixedKey && FIXED_VALUES[fixedKey]
            ? FIXED_VALUES[fixedKey]
            : parseFloat(element.dataset.target);
        const duration = parseInt(element.dataset.duration) || CONFIG.duration;
        const prefix = element.dataset.prefix || CONFIG.prefix;
        const suffix = element.dataset.suffix || CONFIG.suffix;
        const decimals = parseInt(element.dataset.decimals) || 0;

        // Verificar si es un contador en línea
        const isInline = element.classList.contains('counter-inline');

        let startTime = null;
        let startValue = 0;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;

            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Aplicar easing
            const easedProgress = easeOutQuart(progress);
            const currentValue = startValue + (target - startValue) * easedProgress;

            // Formatear y mostrar
            element.textContent = formatNumber(currentValue, decimals, prefix, suffix);

            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                // Asegurar valor final exacto
                element.textContent = formatNumber(target, decimals, prefix, suffix);

                // Solo añadir clase animated si no es inline
                if (!isInline) {
                    element.classList.add('is-animated');
                }
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Función de easing
     */
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    /**
     * Formatear número con separadores
     */
    function formatNumber(num, decimals, prefix, suffix) {
        const fixed = num.toFixed(decimals);
        const parts = fixed.split('.');

        // Añadir separadores de miles
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, CONFIG.separator);

        let result = parts.join(',');

        // Añadir prefijo y sufijo
        if (prefix) result = prefix + result;
        if (suffix) result = result + suffix;

        return result;
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();