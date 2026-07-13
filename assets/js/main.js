document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // 2. Hero Slider
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-indicator-dot');
    let currentSlide = 0;
    const slideInterval = 6000; // Slide change interval in ms
    let autoSlideTimer;

    if (slides.length > 0) {
        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            currentSlide = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideTimer = setInterval(nextSlide, slideInterval);
        }

        function stopAutoSlide() {
            if (autoSlideTimer) {
                clearInterval(autoSlideTimer);
            }
        }

        // Event listeners for dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                startAutoSlide();
            });
        });

        // Initialize first slide and start auto timer
        showSlide(0);
        startAutoSlide();
    }

    // 3. Testimonials Carousel
    const testTrack = document.querySelector('.carousel-track');
    const testSlides = document.querySelectorAll('.carousel-container .carousel-slide');
    const testDots = document.querySelectorAll('.slider-dots .slider-dot');

    if (testTrack && testSlides.length > 0 && testDots.length > 0) {
        function updateTestimonials(index) {
            const windowWidth = window.innerWidth;
            let slideWidthPercent = 100;

            if (windowWidth >= 1024) {
                slideWidthPercent = 33.333;
            } else if (windowWidth >= 768) {
                slideWidthPercent = 50;
            }

            let maxIndex = testSlides.length - 1;
            if (windowWidth >= 1024) {
                maxIndex = 0; // All fit in the container
            } else if (windowWidth >= 768) {
                maxIndex = testSlides.length - 2; // Fits 2
            }

            // Bind target index within boundaries
            let targetIndex = Math.min(Math.max(index, 0), maxIndex);

            // Move track
            testTrack.style.transform = `translateX(-${targetIndex * slideWidthPercent}%)`;

            // Update card states
            testSlides.forEach((slide, i) => {
                const card = slide.querySelector('.testimonial-card');
                if (card) {
                    if (i === targetIndex) {
                        card.classList.add('active');
                    } else {
                        card.classList.remove('active');
                    }
                }
            });

            // Update indicator dots
            testDots.forEach((dot, i) => {
                if (i === targetIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        testDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateTestimonials(index);
            });
        });

        // Adapt positions on resize
        window.addEventListener('resize', () => {
            const activeDotIndex = Array.from(testDots).findIndex(dot => dot.classList.contains('active'));
            updateTestimonials(activeDotIndex >= 0 ? activeDotIndex : 0);
        });

        // Set initial state
        updateTestimonials(0);
    }

    // 4. Navbar Transparent-on-Top / White-on-Scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        function handleNavbarScroll() {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // On subpages (page-hero, not full hero slider), start scrolled/white
        const isSubPage = document.querySelector('.page-hero') !== null;
        if (isSubPage) {
            navbar.classList.add('scrolled');
        }

        // Listen for scroll
        window.addEventListener('scroll', handleNavbarScroll, { passive: true });

        // Run once on load (in case page is already scrolled on refresh)
        handleNavbarScroll();
    }
});
