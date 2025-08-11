// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animate-on-scroll elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Form submission
document.querySelector('#contactForm form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validate form
    const errors = validateForm(formData);
    if (errors.length > 0) {
        alert('Por favor, corrige los siguientes errores:\n' + errors.join('\n'));
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('¡Gracias! He recibido tu solicitud. Te contactaré en las próximas 24 horas para programar tu diagnóstico gratuito.');
        this.reset();
        document.getElementById('contactForm').style.display = 'none';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Active nav link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Form validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm(formData) {
    const errors = [];
    
    if (!formData.get('nombre') || formData.get('nombre').trim() === '') {
        errors.push('El nombre es obligatorio');
    }
    
    if (!formData.get('email') || !validateEmail(formData.get('email'))) {
        errors.push('El email es obligatorio y debe ser válido');
    }
    
    if (!formData.get('mensaje') || formData.get('mensaje').trim() === '') {
        errors.push('El mensaje es obligatorio');
    }
    
    return errors;
}

// Contact form toggle
function toggleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm.style.display === 'none' || contactForm.style.display === '') {
        contactForm.style.display = 'block';
        contactForm.scrollIntoView({ behavior: 'smooth' });
    } else {
        contactForm.style.display = 'none';
    }
}

// Add event listeners for form toggle buttons
document.addEventListener('DOMContentLoaded', function() {
    // Ensure all elements are loaded before adding event listeners
    const contactFormToggle = document.querySelector('a[onclick*="contactForm"]');
    if (contactFormToggle) {
        contactFormToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleContactForm();
        });
    }
    
    // Handle "Consulta Gratuita" button in navigation
    const consultaBtn = document.querySelector('.nav-links .btn-primary');
    if (consultaBtn) {
        consultaBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleContactForm();
        });
    }
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
});

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Trigger initial animation check
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
});

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
    
    // Handle Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('btn')) {
        e.target.click();
    }
});

// Smooth reveal animation for statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number display
        if (element.textContent.includes('x')) {
            element.textContent = Math.floor(current) + 'x';
        } else if (element.textContent.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else if (element.textContent.includes('+')) {
            element.textContent = '+' + Math.floor(current);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize counter animations when visible
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const text = element.textContent;
            
            // Extract number from text
            let targetNumber = parseInt(text.replace(/[^\d]/g, ''));
            
            // Special cases for different formats
            if (text.includes('5-7x')) targetNumber = 7;
            if (text.includes('ROI')) targetNumber = 7;
            
            if (targetNumber > 0) {
                animateCounter(element, targetNumber);
                counterObserver.unobserve(element); // Only animate once
            }
        }
    });
}, { threshold: 0.5 });

// Observe hero stats and result numbers
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.hero-stat-number, .result-number').forEach(el => {
        counterObserver.observe(el);
    });
});