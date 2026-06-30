/**
 * Aetheris Technologies - Global Interactivity Library
 * File: main.js
 * Version: 2.0 (Premium Redesign)
 * Description: Particle networks, scroll reveals, statistics counting,
 *              carousel sliders, smooth accordions, portfolio filters,
 *              and form validations. Pure ES6.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particles Background
    initHeroParticles();

    // 2. Scroll Reveal Animations
    initScrollReveal();

    // 3. Stats Counter Animation
    initStatsCounter();

    // 4. Testimonial Slider
    initTestimonialsSlider();

    // 5. Smooth FAQ Collapsible details
    initSmoothFAQ();

    // 6. Portfolio Card Filtering
    initPortfolioFiltering();

    // 7. Contact Form Floating Labels & Validations
    initFormValidation();

    // 8. Mobile Menu Scoll Lock
    initMobileMenuLock();

    // Redesign Additions
    initStickyNavShrink();
    initAOSAnimation();
    initGSAPAnimations();
});

/**
 * HTML5 Canvas Particle Background
 * Creates an interactive node network in the hero section banner.
 */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set dimensions
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 180, 216, 0.4)';
            ctx.fill();
        }
    }

    // Initialize particles list
    const particlesCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
    const particles = Array.from({ length: particlesCount }, () => new Particle());

    // Track mouse coordinates
    let mouse = { x: null, y: null, radius: 120 };
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 180, 216, ${0.15 * (1 - dist / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Connection to mouse
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(0, 82, 204, ${0.3 * (1 - dist / mouse.radius)})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }
    animate();
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/**
 * Stats Counter Animation
 */
function initStatsCounter() {
    const counterElements = document.querySelectorAll('.stat-counter');
    if (counterElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => observer.observe(el));

    function animateCounter(el) {
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1800; // 1.8 seconds
        const startTime = performance.now();
        const suffix = el.getAttribute('data-suffix') || '';

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // EaseOutQuad function
            const easeProgress = progress * (2 - progress);
            const currentValue = Math.floor(easeProgress * targetValue);

            el.textContent = formatValue(currentValue) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = formatValue(targetValue) + suffix;
            }
        }

        function formatValue(val) {
            if (val >= 1000) {
                return (val / 1000).toFixed(1) + 'K';
            }
            return val;
        }

        requestAnimationFrame(update);
    }
}

/**
 * Testimonial Slider / Carousel
 */
function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonials-dots');
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const intervalTime = 6000; // 6 seconds
    let autoPlayTimer;

    // Create dot indicators
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoplay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonial-dot');

    function goToSlide(index) {
        track.style.transform = `translateX(-${index * 100}%)`;
        dots[currentIndex].classList.remove('active');
        slides[currentIndex].classList.remove('active');
        
        currentIndex = index;
        
        dots[currentIndex].classList.add('active');
        slides[currentIndex].classList.add('active');
    }

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function startAutoplay() {
        autoPlayTimer = setInterval(nextSlide, intervalTime);
    }

    function resetAutoplay() {
        clearInterval(autoPlayTimer);
        startAutoplay();
    }

    startAutoplay();
}

/**
 * Smooth FAQ height accordion transitions
 */
function initSmoothFAQ() {
    const detailsElements = document.querySelectorAll('.faq-item');
    if (detailsElements.length === 0) return;

    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        const content = details.querySelector('.faq-content');

        summary.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (details.hasAttribute('open')) {
                // Shrinking animation
                const contentHeight = content.scrollHeight;
                details.style.height = `${summary.offsetHeight + contentHeight}px`;
                
                // Force layout recalculation
                details.offsetHeight;

                details.style.height = `${summary.offsetHeight}px`;
                details.classList.remove('faq-open');
                
                setTimeout(() => {
                    if (!details.classList.contains('faq-open')) {
                        details.removeAttribute('open');
                        details.style.height = '';
                    }
                }, 300); // matches transition speed
            } else {
                // Expanding animation
                details.setAttribute('open', '');
                const contentHeight = content.scrollHeight;
                details.style.height = `${summary.offsetHeight}px`;
                details.classList.add('faq-open');

                // Force layout recalculation
                details.offsetHeight;

                details.style.height = `${summary.offsetHeight + contentHeight}px`;
                
                setTimeout(() => {
                    if (details.classList.contains('faq-open')) {
                        details.style.height = '';
                    }
                }, 300);
            }
        });
    });
}

/**
 * Portfolio Card Category Filtering
 */
function initPortfolioFiltering() {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const items = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0 || items.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-filter');

            // Toggle active class on controls
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply fade transitions to items
            items.forEach(item => {
                const matches = category === 'all' || item.classList.contains(`cat-${category}`);
                
                if (matches) {
                    item.style.display = 'block';
                    // Trigger fade in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Contact Form Client-side Validations
 */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('.form-control[required]');

    inputs.forEach(input => {
        // Validate on input blur
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('input-error')) {
                validateInput(input);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            e.preventDefault();
            // Scroll to the first error input
            const firstError = form.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    function validateInput(input) {
        const val = input.value.trim();
        let isValid = true;

        if (val === '') {
            isValid = false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(val);
        }

        if (isValid) {
            input.classList.remove('input-error');
            input.classList.add('input-success');
            return true;
        } else {
            input.classList.add('input-error');
            input.classList.remove('input-success');
            return false;
        }
    }
}

/**
 * Mobile Navigation Drawer Scroll Lock
 */
function initMobileMenuLock() {
    const toggle = document.getElementById('mobile-menu-toggle');
    if (!toggle) return;

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.checked = false;
            document.body.style.overflow = '';
        });
    });
}

/**
 * Redesign: Sticky Nav Shrink on Scroll
 */
function initStickyNavShrink() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('nav-shrink');
        } else {
            header.classList.remove('nav-shrink');
        }
    });
}

/**
 * Redesign: Initialize AOS Animation
 */
function initAOSAnimation() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-quad',
            once: true,
            offset: 80
        });
    }
}

/**
 * Redesign: GSAP Page Load & Interactive Animations
 */
function initGSAPAnimations() {
    if (typeof gsap !== 'undefined') {
        // Hero Content Fade-in
        gsap.from('.hero-content > *', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Hero Illustration floating animation
        gsap.to('.hero-illustration', {
            y: -15,
            duration: 4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });

        // Mouse Parallax on Hero Graphics
        const heroSection = document.getElementById('home-hero');
        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { width, height } = heroSection.getBoundingClientRect();
                const xPos = (clientX / width - 0.5) * 20;
                const yPos = (clientY / height - 0.5) * 20;

                gsap.to('.illustration-sphere', { x: xPos, y: yPos, duration: 1, ease: 'power2.out' });
                gsap.to('.illustration-ring-1', { x: -xPos * 0.5, y: -yPos * 0.5, duration: 1.5, ease: 'power2.out' });
                gsap.to('.illustration-ring-2', { x: xPos * 0.8, y: yPos * 0.8, duration: 1.8, ease: 'power2.out' });
            });
        }
    }
}
