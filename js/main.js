// ==========================================
// 🧭 Main JS — Navbar, Footer, Shared Logic
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    renderFooter();
    initNavbarScroll();
    initMobileMenu();
    initScrollAnimations();
    initTheme();
});

/**
 * تحديد الصفحة الحالية من الـ URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

/**
 * رندر الـ Navbar
 */
function renderNavbar() {
    const currentPage = getCurrentPage();
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const navLinks = [
        { href: 'index.html', label: 'الرئيسية', page: 'index.html' },
        { href: 'courses.html', label: 'المواد', page: 'courses.html' },
        { href: 'about.html', label: 'من نحن', page: 'about.html' },
        { href: 'contact.html', label: 'تواصل معنا', page: 'contact.html' }
    ];

    navbar.innerHTML = `
        <div class="mobile-overlay" id="mobileOverlay"></div>
        <div class="container">
            <a href="index.html" class="navbar-brand">
                <img src="assets/icons/logo.svg" alt="شعار" style="width: 40px; height: 40px;">
                ${siteConfig.name}
            </a>
            <div style="display: flex; align-items: center; gap: var(--space-md);">
                <button id="logoutBtn" aria-label="تسجيل خروج" title="تسجيل خروج">
                    <svg class="logout-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span class="logout-text">تسجيل خروج</span>
                </button>
                <button class="theme-toggle" id="themeToggle" aria-label="تبديل المظهر" onclick="toggleTheme()" style="background: transparent; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%;">
                    <svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    <svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </button>
                <nav class="navbar-nav" id="navbarNav">
                    <div class="drawer-header">
                        <a href="index.html" class="drawer-brand">
                            <img src="assets/icons/logo.svg" alt="شعار" style="width: 32px; height: 32px;">
                            <span>${siteConfig.name}</span>
                        </a>
                        <button type="button" class="drawer-close" id="drawerClose" aria-label="إغلاق القائمة">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                ${navLinks.map(link => `
                    <a href="${link.href}" class="${currentPage === link.page || (currentPage === '' && link.page === 'index.html') ? 'active' : ''}">${link.label}</a>
                `).join('')}
            </nav>
            <button class="navbar-toggle" id="navbarToggle" aria-label="القائمة">
                <span></span>
                <span></span>
                <span></span>
            </button>
            </div>
        </div>
    `;
}

/**
 * رندر الـ Footer
 */
function renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;

    footer.innerHTML = `
        <div class="container">
            <div class="footer-grid">
                <div class="footer-brand">
                    <a href="index.html" class="navbar-brand">
                        <img src="assets/icons/logo.svg" alt="شعار" style="width: 40px; height: 40px;">
                        ${siteConfig.name}
                    </a>
                    <p>${siteConfig.description}</p>
                </div>
                <div class="footer-col">
                    <h3>روابط سريعة</h3>
                    <ul>
                        <li><a href="index.html">الرئيسية</a></li>
                        <li><a href="courses.html">المواد</a></li>
                        <li><a href="about.html">من نحن</a></li>
                        <li><a href="contact.html">تواصل معنا</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>المواد</h3>
                    <ul>
                        ${courses.map(course => `
                            <li><a href="course.html?id=${course.id}">${course.title}</a></li>
                        `).join('')}
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>تواصل معنا</h3>
                    <ul>
                        ${siteConfig.email ? `<li><a href="mailto:${siteConfig.email}" onclick="if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){ window.open('https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}', '_blank'); return false; }">${siteConfig.email}</a></li>` : ''}
                        ${siteConfig.phone ? `<li><a href="tel:${siteConfig.phone}" dir="ltr" style="text-align: right; display: inline-block;">${siteConfig.phone}</a></li>` : ''}
                        ${siteConfig.address ? `<li>${siteConfig.address}</li>` : ''}
                    </ul>
                    <div style="margin-top: var(--space-lg);">
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-sm);">لمتابعة جديد المحاضرات والملخصات، انضم لجروب الواتساب.</p>
                        <a href="${siteConfig.social.whatsappGroup}" target="_blank" rel="noopener noreferrer" class="btn btn-cta btn-sm" style="display: inline-flex; align-items: center; gap: 8px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                            انضم لجروب الواتساب
                        </a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p>${siteConfig.footerText}</p>
                <div class="footer-social">
                    <a href="${siteConfig.social.whatsappGroup}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="جروب الواتساب" title="جروب الواتساب">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    </a>
                    <a href="mailto:${siteConfig.email}" onclick="if(!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){ window.open('https://mail.google.com/mail/?view=cm&fs=1&to=${siteConfig.email}', '_blank'); return false; }" class="social-link" aria-label="البريد الإلكتروني" title="البريد الإلكتروني">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </a>
                    <a href="tel:${siteConfig.phone}" class="social-link" aria-label="رقم الهاتف" title="رقم الهاتف">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                    </a>
                </div>
            </div>
        </div>
    `;
}

/**
 * Navbar scroll effect
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('navbarToggle');
    const nav = document.getElementById('navbarNav');
    const overlay = document.getElementById('mobileOverlay');
    const drawerClose = document.getElementById('drawerClose');

    if (!toggle || !nav) return;

    function closeMenu() {
        if (navbar) navbar.classList.remove('menu-open');
        toggle.classList.remove('active');
        nav.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openMenu() {
        if (navbar) navbar.classList.add('menu-open');
        toggle.classList.add('active');
        nav.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    toggle.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (drawerClose) {
        drawerClose.addEventListener('click', closeMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Close on nav link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('active')) {
            closeMenu();
        }
    }, { passive: true });
}

/**
 * Scroll-based fade-in animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animType = entry.target.dataset.animate || 'fadeInUp';
                entry.target.style.animation = `${animType} 0.6s ease forwards`;
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Helper: Generate course card image (CSS gradient fallback)
 */
function getCourseImageHTML(course) {
    return `
        <div style="position: relative; width: 100%; height: 100%;">
            <img src="${course.image}" alt="${course.imageAlt || course.title}" loading="lazy" style="width:100%; height:100%; object-fit:cover;">
            <div style="position: absolute; inset: 0; background: var(--bg-image-overlay); pointer-events: none;"></div>
        </div>
    `;
}

/**
 * تهيئة المظهر (Theme)
 */
function initTheme() {
    // When the website first loads, always start in Light Mode.
    if (!sessionStorage.getItem('theme_initialized')) {
        localStorage.setItem('theme', 'light');
        sessionStorage.setItem('theme_initialized', 'true');
    }
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Ensure icons are updated if they exist
    setTimeout(updateThemeIcon, 0);
}

/**
 * تبديل المظهر
 */
function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const sun = document.querySelector('.sun-icon');
    const moon = document.querySelector('.moon-icon');
    if(sun && moon) {
        sun.style.display = isDark ? 'block' : 'none';
        moon.style.display = isDark ? 'none' : 'block';
    }
}

/**
 * Helper: Generate instructor image with fallback
 */
function getInstructorImageHTML(course, size = 36) {
    const initial = course.creator.charAt(course.creator.length > 2 ? 2 : 0);
    return `<img src="${course.creatorImage}" alt="${course.creator}" 
                class="instructor-avatar" 
                style="width:${size}px;height:${size}px;" 
                onerror="this.outerHTML='<div class=\\'instructor-avatar\\' style=\\'width:${size}px;height:${size}px;background:rgba(99, 102, 241, 0.15);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${size*0.4}px;color:var(--text-primary);border-radius:50%;border:2px solid rgba(99, 102, 241, 0.3)\\'>${initial}</div>'">`;
}
