/**
 * J&B Enterprises Website - Interactive Features
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Navbar Scroll Effect
    // ========================================
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar);
    updateNavbar();

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    mobileMenuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // ========================================
    // Smooth Scroll for Navigation Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Active Navigation Link on Scroll
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

    function highlightNavOnScroll() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // ========================================
    // EmailJS Configuration
    // ========================================
    const EMAILJS_SERVICE_ID = 'service_q6qdrio';
    const EMAILJS_TEMPLATE_ID = 'template_92i498j';
    const EMAILJS_PUBLIC_KEY = 'rBNu35pVTaft6-U76';

    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);

    // ========================================
    // Contact Form Handling with EmailJS
    // ========================================
    const quoteForm = document.getElementById('quoteForm');
    const formSuccess = document.getElementById('formSuccess');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const projectType = formData.get('projectType');
            const message = formData.get('message');

            // Map project type to readable format
            const projectTypeLabels = {
                'kitchen': 'Kitchen Cabinets',
                'bathroom': 'Bathroom Vanity',
                'closet': 'Closet/Storage',
                'office': 'Office Built-ins',
                'other': 'Other'
            };

            // Prepare template parameters
            const templateParams = {
                client_name: `${firstName} ${lastName}`,
                client_email: email,
                client_phone: phone,
                project_type: projectTypeLabels[projectType] || projectType,
                project_message: message || 'No additional details provided.'
            };

            // Show loading state
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Send email using EmailJS
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);

                    // Show success message
                    quoteForm.classList.add('hidden');
                    formSuccess.classList.remove('hidden');

                    // Reset form
                    quoteForm.reset();

                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        quoteForm.classList.remove('hidden');
                        formSuccess.classList.add('hidden');
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    }, 5000);
                }, function(error) {
                    console.log('FAILED...', error);
                    alert('Sorry, there was an error sending your message. Please try again or contact us directly at 083 3356 627.');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    // ========================================
    // Phone Input Formatting
    // ========================================
    const phoneInput = document.getElementById('phone');

    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }

        e.target.value = value;
    });

    // ========================================
    // Gallery Slider
    // ========================================
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const currentSlideEl = document.querySelector('.current-slide');
    const thumbnailsTrack = document.querySelector('.thumbnails-track');
    const thumbnailPrev = document.querySelector('.thumbnail-prev');
    const thumbnailNext = document.querySelector('.thumbnail-next');

    let currentSlide = 0;
    let autoSlideInterval;
    const totalSlides = slides.length;

    // Update total slides display
    document.querySelector('.total-slides').textContent = totalSlides;

    // Create thumbnails
    function createThumbnails() {
        slides.forEach((slide, index) => {
            const imgSrc = slide.querySelector('img').src;
            const thumbnail = document.createElement('div');
            thumbnail.className = 'gallery-thumbnail';
            thumbnail.dataset.index = index;
            thumbnail.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;

            thumbnail.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });

            thumbnailsTrack.appendChild(thumbnail);
        });

        updateThumbnails();
    }

    function updateThumbnails() {
        const thumbnails = document.querySelectorAll('.gallery-thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentSlide);
        });

        // Scroll thumbnails to keep active one visible
        const activeThumb = thumbnails[currentSlide];
        if (activeThumb) {
            const container = document.querySelector('.thumbnails-container');
            const containerRect = container.getBoundingClientRect();
            const thumbRect = activeThumb.getBoundingClientRect();
            const track = document.querySelector('.thumbnails-track');

            if (thumbRect.left < containerRect.left) {
                track.style.transform = `translateX(-${currentSlide * 110}px)`;
            } else if (thumbRect.right > containerRect.right) {
                const offset = (currentSlide - 4) * 110;
                track.style.transform = `translateX(-${Math.max(0, offset)}px)`;
            }
        }
    }

    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        currentSlideEl.textContent = currentSlide + 1;
        updateThumbnails();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlide();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlide();
    }

    function goToSlide(index) {
        currentSlide = index;
        updateSlide();
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // Event listeners
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoSlide();
        }
    });

    // Thumbnail navigation
    let thumbnailOffset = 0;
    const thumbnailWidth = 110;

    if (thumbnailPrev && thumbnailNext) {
        thumbnailPrev.addEventListener('click', () => {
            thumbnailOffset = Math.max(0, thumbnailOffset - thumbnailWidth * 4);
            thumbnailsTrack.style.transform = `translateX(-${thumbnailOffset}px)`;
        });

        thumbnailNext.addEventListener('click', () => {
            const maxOffset = (totalSlides - 6) * thumbnailWidth;
            thumbnailOffset = Math.min(maxOffset, thumbnailOffset + thumbnailWidth * 4);
            thumbnailsTrack.style.transform = `translateX(-${thumbnailOffset}px)`;
        });
    }

    // Initialize
    if (slides.length > 0) {
        createThumbnails();
        updateSlide();
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // Pause on hover
    const gallerySlider = document.querySelector('.gallery-slider');
    if (gallerySlider) {
        gallerySlider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        gallerySlider.addEventListener('mouseleave', () => {
            autoSlideInterval = setInterval(nextSlide, 5000);
        });
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (gallerySlider) {
        gallerySlider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        gallerySlider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetAutoSlide();
        }
    }

    // ========================================
    // Animate Elements on Scroll (Intersection Observer)
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards, gallery slider, and testimonial cards
    document.querySelectorAll('.service-card, .gallery-slider-container, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS class for animated elements
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Stats Counter Animation
    // ========================================
    const statsSection = document.querySelector('.stats');
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const statsRect = statsSection.getBoundingClientRect();
        if (statsRect.top < window.innerHeight && statsRect.bottom > 0) {
            statsAnimated = true;

            statNumbers.forEach(stat => {
                const finalValue = stat.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/[0-9]/g, '');
                let currentValue = 0;
                const duration = 2000;
                const increment = numericValue / (duration / 16);

                const updateCounter = () => {
                    currentValue += increment;
                    if (currentValue < numericValue) {
                        stat.textContent = Math.floor(currentValue) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = finalValue;
                    }
                };

                updateCounter();
            });
        }
    }

    window.addEventListener('scroll', animateStats);

    // ========================================
    // Preloader (Optional)
    // ========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});
