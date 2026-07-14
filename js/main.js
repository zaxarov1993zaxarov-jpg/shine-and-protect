/**
 * Shine & Protect - Main JavaScript
 * Premium PPF Shop Website
 */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initSmoothScroll();
    initHeroSlideshow();
    initSectionSlideshows();
    initServiceTabs(); // Added service tabs functionality
    initGalleryLightbox();
    initKnowledgeCenter();
});

// ===== HERO SLIDESHOW =====
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    // Show first slide
    showSlide(0);
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
}

// ===== SECTION BACKGROUND SLIDESHOWS =====
function initSectionSlideshows() {
    const sections = document.querySelectorAll('.section-bg-slideshow');
    
    sections.forEach(section => {
        const bgSlides = section.querySelectorAll('.bg-slide');
        if (bgSlides.length === 0) return;
        
        let currentSlide = 0;
        
        function showSlide(index) {
            bgSlides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % bgSlides.length;
            showSlide(currentSlide);
        }
        
        // Show first slide
        showSlide(0);
        
        // Change slide every 8 seconds
        setInterval(nextSlide, 8000);
    });
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar sticky scroll effect
    const updateNavbarScrollState = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    };

    updateNavbarScrollState();
    window.addEventListener('scroll', updateNavbarScrollState, { passive: true });
    
    // Mobile menu toggle
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });
    }
    
    // Close menu when clicking overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // Toggle menu function
    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Open menu
    function openMenu() {
        navMenu.classList.add('active');
        menuOverlay.classList.add('active');
        mobileMenuToggle.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Close menu
    function closeMenu() {
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // Close mobile menu when window resizes to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Stagger animation for child elements
                const children = entry.target.querySelectorAll('[data-aos]');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('aos-animate');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Get form data
            const formData = new FormData(form);
            
            // Submit to Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success message
                form.style.display = 'none';
                formSuccess.classList.add('active');
                form.reset();
                
                // Reset after 10 seconds
                setTimeout(function() {
                    form.style.display = 'flex';
                    formSuccess.classList.remove('active');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }, 10000);
            } else {
                // Handle Formspree errors
                console.error('Formspree error:', data);
                throw new Error(data.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show user-friendly error
            const errorMsg = 'Unable to send message. Please contact us directly:\n\nPhone: (267) 227-0089\nEmail: shineandprotectshop@gmail.com';
            alert(errorMsg);
            
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'service', 'message'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showFormError(`Please fill in the ${field} field.`);
            return false;
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showFormError('Please enter a valid email address.');
        return false;
    }
    
    // Validate phone
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
        showFormError('Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

function showFormError(message) {
    // Create temporary error message
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
        background: rgba(74, 158, 255, 0.1);
        border: 1px solid #4A9EFF;
        color: #4A9EFF;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    errorDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    
    const form = document.getElementById('contactForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Smooth scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove error after 8 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 8000);
}

// ===== GALLERY LIGHTBOX =====
function initGalleryLightbox() {
    const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImage = document.getElementById('galleryLightboxImage');
    const lightboxCaption = document.getElementById('galleryLightboxCaption');
    const closeBtn = document.getElementById('galleryLightboxClose');
    const prevBtn = document.getElementById('galleryLightboxPrev');
    const nextBtn = document.getElementById('galleryLightboxNext');
    const backdrop = lightbox ? lightbox.querySelector('.gallery-lightbox-backdrop') : null;

    if (!lightbox || galleryImages.length === 0 || !lightboxImage) return;

    let currentIndex = 0;

    function showImage(index) {
        const image = galleryImages[index];
        if (!image) return;

        currentIndex = index;
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = image.alt;
    }

    function openLightbox(index) {
        showImage(index);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        lightboxImage.removeAttribute('src');
    }

    function showPrevious() {
        const nextIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        showImage(nextIndex);
    }

    function showNext() {
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        showImage(nextIndex);
    }

    galleryImages.forEach((image, index) => {
        image.closest('.gallery-item').addEventListener('click', function() {
            openLightbox(index);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevious();
    });
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNext();
    });

    backdrop.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function(e) {
        const interactive = e.target.closest(
            '.gallery-lightbox-image, .gallery-lightbox-nav, .gallery-lightbox-close, .gallery-lightbox-caption'
        );
        if (!interactive) {
            closeLightbox();
        }
    });

    lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevious();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    });
}

// ===== KNOWLEDGE CENTER =====
function initKnowledgeCenter() {
    initArticleFaq();
    initArticleToc();
    initKnowledgeCenterLayout();
    initKnowledgeCenterSearch();
}

function initKnowledgeCenterLayout() {
    const page = document.querySelector('.kc-page');
    const navbar = document.getElementById('navbar');
    if (!page || !navbar) return;

    const updateOffset = () => {
        const height = Math.ceil(navbar.getBoundingClientRect().height);
        page.style.setProperty('--kc-nav-offset', `${height}px`);
    };

    updateOffset();
    window.addEventListener('resize', throttle(updateOffset, 100));
}

function initKnowledgeCenterSearch() {
    const searchInput = document.getElementById('kcSearchInput');
    const searchForm = document.getElementById('kcSearchForm');
    const articles = document.querySelectorAll('#kcArticlesList .kc-featured-card');
    const emptyState = document.getElementById('kcArticlesEmpty');
    const categoryCards = document.querySelectorAll('.kc-category-card[data-category]');

    if (!searchInput || articles.length === 0) return;

    let activeCategory = '';

    const applyFilters = () => {
        const query = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        articles.forEach(article => {
            const title = (article.dataset.title || '').toLowerCase();
            const category = (article.dataset.category || '').toLowerCase();
            const excerpt = (article.dataset.excerpt || '').toLowerCase();
            const matchesQuery = !query || title.includes(query) || category.includes(query) || excerpt.includes(query);
            const matchesCategory = !activeCategory || category === activeCategory.toLowerCase();
            const isVisible = matchesQuery && matchesCategory;

            article.classList.toggle('is-hidden', !isVisible);
            if (isVisible) visibleCount += 1;
        });

        if (emptyState) {
            emptyState.hidden = visibleCount > 0;
        }
    };

    searchInput.addEventListener('input', applyFilters);

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category || '';
            const isSame = activeCategory === category;

            activeCategory = isSame ? '' : category;

            categoryCards.forEach(other => {
                other.classList.toggle('is-active', other === this && !isSame);
            });

            applyFilters();

            const articlesSection = document.getElementById('latest-articles');
            if (articlesSection) {
                const navbar = document.getElementById('navbar');
                const offset = navbar ? navbar.offsetHeight + 16 : 16;
                const top = articlesSection.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
}

function initArticleFaq() {
    const faqItems = document.querySelectorAll('.kc-faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.kc-faq-question');
        if (!question) return;

        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('is-open');

            faqItems.forEach(other => {
                other.classList.remove('is-open');
                const otherQuestion = other.querySelector('.kc-faq-question');
                if (otherQuestion) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                }
            });

            if (!isOpen) {
                item.classList.add('is-open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

function initArticleToc() {
    const toc = document.getElementById('articleToc');
    const content = document.getElementById('articleContent');

    if (!toc || !content) return;

    const tocLinks = toc.querySelectorAll('a[href^="#"]');
    const sections = Array.from(tocLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            e.preventDefault();
            const navbar = document.getElementById('navbar');
            const offset = navbar ? navbar.offsetHeight + 24 : 24;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    if (sections.length === 0) return;

    const updateActiveLink = () => {
        const navbar = document.getElementById('navbar');
        const offset = navbar ? navbar.offsetHeight + 48 : 48;
        let currentId = sections[0].id;

        sections.forEach(section => {
            if (section.getBoundingClientRect().top <= offset) {
                currentId = section.id;
            }
        });

        tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    };

    window.addEventListener('scroll', throttle(updateActiveLink, 100));
    updateActiveLink();
}

// ===== UTILITIES =====

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== PERFORMANCE OPTIMIZATIONS =====

// Lazy load images (if you add real images later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== ADDITIONAL FEATURES =====

// Add parallax effect to hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.scrollY;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }, 16)); // ~60fps
}

// ===== SERVICE TABS FUNCTIONALITY =====
function initServiceTabs() {
    const tabButtons = document.querySelectorAll('.service-tab');
    const tabContents = document.querySelectorAll('.service-tab-content');
    
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show target tab content
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Counter animation for stats
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent.replace(/\D/g, '')) || 100;
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 30);
}

// Initialize optional features
window.addEventListener('load', () => {
    initLazyLoading();
    // initParallax(); // Uncomment if you want parallax effect
    initCounters();
});

// ===== CONSOLE BRANDING =====
console.log(
    '%cShine & Protect%c\n' +
    'Premium PPF Installations\n' +
    'Quakertown, PA\n' +
    '(267) 227-0089',
    'color: #4A9EFF; font-size: 24px; font-weight: bold;',
    'color: #B8C5D0; font-size: 12px;'
);

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('An error occurred:', e.error);
});

// ===== SERVICE WORKER (Optional - for PWA features) =====
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered'))
    //     .catch(err => console.log('Service Worker registration failed'));
}