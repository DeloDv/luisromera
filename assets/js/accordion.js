/**
 * accordion.js - Sistema de acordeón accesible para FAQs
 * @author Luis Romera Web
 * @description Acordeones con soporte completo de teclado y ARIA
 */

(function() {
    'use strict';

    const CONFIG = {
        containerClass: '.faq-accordion',
        itemClass: '.faq-item',
        triggerClass: '.faq-trigger',
        panelClass: '.faq-panel',
        activeClass: 'is-open',
        animationDuration: 300
    };

    let accordions = [];

    /**
     * Inicialización
     */
    function init() {
        const containers = document.querySelectorAll(CONFIG.containerClass);
        if (containers.length === 0) return;
        
        containers.forEach(container => {
            new Accordion(container);
        });
    }

    /**
     * Clase Accordion
     */
    class Accordion {
        constructor(container) {
            this.container = container;
            this.items = [];
            this.triggers = [];
            this.panels = [];
            this.multiExpand = container.dataset.multiExpand === 'true';
            
            this.setupAccordion();
            this.attachEvents();
        }

        /**
         * Configurar estructura del acordeón
         */
        setupAccordion() {
            const items = this.container.querySelectorAll(CONFIG.itemClass);
            
            items.forEach((item, index) => {
                const trigger = item.querySelector(CONFIG.triggerClass);
                const panel = item.querySelector(CONFIG.panelClass);
                
                if (!trigger || !panel) return;
                
                // Generar IDs únicos
                const itemId = `accordion-${Date.now()}-${index}`;
                const triggerId = `${itemId}-trigger`;
                const panelId = `${itemId}-panel`;
                
                // Configurar ARIA
                trigger.setAttribute('id', triggerId);
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('aria-controls', panelId);
                
                panel.setAttribute('id', panelId);
                panel.setAttribute('aria-labelledby', triggerId);
                panel.setAttribute('role', 'region');
                panel.hidden = true;
                
                // Hacer trigger focuseable
                if (trigger.tagName !== 'BUTTON') {
                    trigger.setAttribute('role', 'button');
                    trigger.setAttribute('tabindex', '0');
                }
                
                // Guardar referencias
                this.items.push(item);
                this.triggers.push(trigger);
                this.panels.push(panel);
            });
        }

        /**
         * Adjuntar eventos
         */
        attachEvents() {
            this.triggers.forEach((trigger, index) => {
                // Click
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle(index);
                });
                
                // Teclado
                trigger.addEventListener('keydown', (e) => {
                    this.handleKeydown(e, index);
                });
            });
        }

        /**
         * Toggle item del acordeón
         */
        toggle(index) {
            const item = this.items[index];
            const trigger = this.triggers[index];
            const panel = this.panels[index];
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            
            if (isOpen) {
                this.close(index);
            } else {
                // Cerrar otros si no es multi-expand
                if (!this.multiExpand) {
                    this.triggers.forEach((t, i) => {
                        if (i !== index && t.getAttribute('aria-expanded') === 'true') {
                            this.close(i);
                        }
                    });
                }
                this.open(index);
            }
        }

        /**
         * Abrir panel
         */
        open(index) {
            const item = this.items[index];
            const trigger = this.triggers[index];
            const panel = this.panels[index];
            
            trigger.setAttribute('aria-expanded', 'true');
            panel.hidden = false;
            
            // Animación de apertura
            requestAnimationFrame(() => {
                panel.style.height = '0px';
                panel.style.overflow = 'hidden';
                panel.style.transition = `height ${CONFIG.animationDuration}ms ease`;
                
                requestAnimationFrame(() => {
                    panel.style.height = panel.scrollHeight + 'px';
                    
                    setTimeout(() => {
                        panel.style.height = '';
                        panel.style.overflow = '';
                        panel.style.transition = '';
                        item.classList.add(CONFIG.activeClass);
                    }, CONFIG.animationDuration);
                });
            });
        }

        /**
         * Cerrar panel
         */
        close(index) {
            const item = this.items[index];
            const trigger = this.triggers[index];
            const panel = this.panels[index];
            
            trigger.setAttribute('aria-expanded', 'false');
            item.classList.remove(CONFIG.activeClass);
            
            // Animación de cierre
            panel.style.height = panel.scrollHeight + 'px';
            panel.style.overflow = 'hidden';
            panel.style.transition = `height ${CONFIG.animationDuration}ms ease`;
            
            requestAnimationFrame(() => {
                panel.style.height = '0px';
                
                setTimeout(() => {
                    panel.hidden = true;
                    panel.style.height = '';
                    panel.style.overflow = '';
                    panel.style.transition = '';
                }, CONFIG.animationDuration);
            });
        }

        /**
         * Manejo de teclado
         */
        handleKeydown(e, index) {
            const key = e.key;
            
            switch(key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    this.toggle(index);
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    this.focusNext(index);
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    this.focusPrevious(index);
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.triggers[0].focus();
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.triggers[this.triggers.length - 1].focus();
                    break;
            }
        }

        /**
         * Focus siguiente trigger
         */
        focusNext(index) {
            const nextIndex = (index + 1) % this.triggers.length;
            this.triggers[nextIndex].focus();
        }

        /**
         * Focus trigger anterior
         */
        focusPrevious(index) {
            const prevIndex = (index - 1 + this.triggers.length) % this.triggers.length;
            this.triggers[prevIndex].focus();
        }
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();