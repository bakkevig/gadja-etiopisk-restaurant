/**
 * Gådjå Etiopisk Restaurant - Main JavaScript
 * Handles mobile navigation, smooth scrolling, and language toggle
 */

(function() {
    'use strict';

    // ==================== Mobile Navigation ====================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    let isMenuOpen = false;

    /**
     * Toggle mobile menu open/closed state
     */
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        mobileMenu.classList.toggle('open');
        mobileMenu.classList.toggle('hidden');

        // Update icon (hamburger <-> X)
        if (isMenuOpen) {
            menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            mobileMenuBtn.setAttribute('aria-label', 'Lukk meny');
        } else {
            menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            mobileMenuBtn.setAttribute('aria-label', 'Åpne meny');
        }
    }

    // Mobile menu button click handler
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking a link
    const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    mobileNavLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
    });

    // ==================== Smooth Scrolling ====================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });

    // ==================== Language Toggle ====================
    let currentLang = 'no'; // Default to Norwegian

    const langToggle = document.getElementById('lang-toggle');
    const langToggleMobile = document.getElementById('lang-toggle-mobile');
    const langFlag = document.getElementById('lang-flag');
    const langFlagMobile = document.getElementById('lang-flag-mobile');
    const langText = document.getElementById('lang-text');
    const langTextMobile = document.getElementById('lang-text-mobile');

    // Get all elements with data-no and data-en attributes
    const translatableElements = document.querySelectorAll('[data-no][data-en]');

    /**
     * Switch language and update all translatable elements
     */
    function switchLanguage() {
        currentLang = currentLang === 'no' ? 'en' : 'no';

        // Update toggle buttons
        const flag = currentLang === 'no' ? '🇳🇴' : '🇬🇧';
        const text = currentLang === 'no' ? 'NO' : 'EN';

        if (langFlag) langFlag.textContent = flag;
        if (langFlagMobile) langFlagMobile.textContent = flag;
        if (langText) langText.textContent = text;
        if (langTextMobile) langTextMobile.textContent = text;

        // Update HTML lang attribute
        document.documentElement.lang = currentLang === 'no' ? 'no' : 'en';

        // Update all translatable elements
        translatableElements.forEach(function(element) {
            const translation = element.getAttribute('data-' + currentLang);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Save preference to localStorage
        try {
            localStorage.setItem('gadja-lang', currentLang);
        } catch (e) {
            // localStorage not available
        }
    }

    // Language toggle click handlers
    if (langToggle) {
        langToggle.addEventListener('click', switchLanguage);
    }
    if (langToggleMobile) {
        langToggleMobile.addEventListener('click', switchLanguage);
    }

    // Load saved language preference
    function loadLanguagePreference() {
        try {
            const savedLang = localStorage.getItem('gadja-lang');
            if (savedLang && savedLang !== currentLang) {
                switchLanguage();
            }
        } catch (e) {
            // localStorage not available
        }
    }

    // ==================== Fade-in Animation on Scroll ====================
    const fadeElements = document.querySelectorAll('.fade-in');

    /**
     * Check if element is in viewport and add visible class
     */
    function checkFadeIn() {
        const triggerBottom = window.innerHeight * 0.85;

        fadeElements.forEach(function(element) {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    }

    // Run on scroll with throttle for performance
    let scrollTimeout;
    function throttledCheckFadeIn() {
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(function() {
            checkFadeIn();
            scrollTimeout = null;
        }, 50);
    }

    window.addEventListener('scroll', throttledCheckFadeIn);

    // ==================== Image Lazy Loading Enhancement ====================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    lazyImages.forEach(function(img) {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                img.classList.add('loaded');
            });
        }
    });

    // ==================== Navigation Background on Scroll ====================
    const nav = document.querySelector('nav');
    let lastScrollY = 0;

    function updateNavOnScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            nav.classList.add('shadow-xl');
        } else {
            nav.classList.remove('shadow-xl');
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', function() {
        requestAnimationFrame(updateNavOnScroll);
    });

    // ==================== Menu Accordion ====================
    const accordionButtons = document.querySelectorAll('.accordion-btn');

    accordionButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.accordion-icon');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle current accordion
            this.setAttribute('aria-expanded', !isExpanded);
            content.classList.toggle('hidden');

            // Rotate icon
            if (icon) {
                icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    });

    // ==================== Initialize ====================
    function init() {
        // Load language preference
        loadLanguagePreference();

        // Initial fade-in check
        checkFadeIn();

        // Initial nav state
        updateNavOnScroll();

        // Mark page as loaded
        document.body.classList.add('loaded');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
