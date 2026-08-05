/* ============================================
SCRIPT.JS - Luciano Longo Portfolio
Versione: 2.3 | WCAG 2.2 AA
============================================ */

// === 0. Fallback Accessibilità (JS attivo) ===
document.documentElement.classList.remove('no-js');

// === Utility: Throttle ===
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => { inThrottle = false; }, limit);
        }
    };
}

// === Focus Trap per Modali (WCAG 2.1/2.2 AA) ===
function trapFocus(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    
    const handler = (e) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
    };
    modal.addEventListener('keydown', handler);
    modal._focusTrapHandler = handler; // Riferimento per pulizia
}

// === Gestione Scroll Ricerca (Carousel Dinamico) ===
window.scrollResearch = function(direction) {
    const container = document.getElementById('research-scroll');
    if (container) {
        const card = container.querySelector('article');
        const gap = 24; // 1.5rem (gap-6)
        const scrollAmount = direction * ((card?.offsetWidth || 320) + gap);
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
};

// === API Modali (Sincronizzata & Accessibile) ===
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Blocca scroll e salva posizione
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    
    // Attiva Focus Trap
    trapFocus(modal);
    setTimeout(() => {
        const closeBtn = modal.querySelector('[aria-label^="Chiudi"], [aria-label^="Close"]') || modal.querySelector('button');
        closeBtn?.focus();
    }, 50);
};

window.closeModal = function(modalId) {
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    if (!modal) return;

    // scroll in modo matematico
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    window.scrollTo({ top: parseInt(scrollY || '0', 10), behavior: 'auto' });
    
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.documentElement.style.removeProperty('--scroll-y');

    
    if (modal._focusTrapHandler) {
        modal.removeEventListener('keydown', modal._focusTrapHandler);
        delete modal._focusTrapHandler;
    }
};

// === Inizializzazione DOM ===
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Mobile Menu ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        const icon = mobileBtn.querySelector('i');
        const toggleMenu = () => {
            const isOpen = mobileMenu.classList.toggle('hidden');
            mobileBtn.setAttribute('aria-expanded', !isOpen);
            icon?.classList.toggle('fa-bars', !isOpen);
            icon?.classList.toggle('fa-times', isOpen);
        };
        mobileBtn.addEventListener('click', e => { e.stopPropagation(); toggleMenu(); });
        document.addEventListener('click', e => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && e.target !== mobileBtn) toggleMenu();
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileBtn.setAttribute('aria-expanded', 'false');
                icon?.classList.add('fa-bars');
                icon?.classList.remove('fa-times');
            });
        });
    }

    // --- 2. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', throttle(() => navbar.classList.toggle('shadow-lg', window.scrollY > 50), 100), { passive: true });
    }

    // --- 3. Smooth Scroll per Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.includes('index.html')) return;
            const target = document.getElementById(href.replace('#', ''));
            if (target) {
                e.preventDefault();
                const offset = target.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({ top: offset, behavior: 'smooth' });
                history.pushState(null, '', href);
            }
        });
    });

    // --- 4. Active Nav Link Highlight ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.lux-link, .mobile-link');
    if (sections.length && navLinks.length) {
        const updateNav = () => {
            const scrollY = window.pageYOffset;
            let current = '';
            sections.forEach(sec => {
                if (scrollY >= sec.offsetTop - 150 && scrollY < sec.offsetTop + sec.offsetHeight) current = sec.id;
            });
            navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href')?.replace('#', '') === current));
        };
        window.addEventListener('scroll', throttle(updateNav, 100), { passive: true });
        updateNav();
    }

    // --- 5. Intersection Observer (Reveal) ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.section-animate').forEach(el => observer.observe(el));

    // --- 6. Back to Top ---
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', throttle(() => {
            const visible = window.scrollY > 300;
            backToTop.classList.toggle('visible', visible);
            backToTop.classList.toggle('pulse', visible);
        }, 100), { passive: true });
        
        backToTop.addEventListener('click', () => {
            // Gestione fallback per SPA/sezioni nascoste (se presente nel tuo setup)
            const pres = document.getElementById('presentation');
            if (pres?.classList.contains('section-hidden')) {
                document.querySelectorAll('section[id], footer[id]').forEach(s => s.classList.add('section-hidden'));
                pres.classList.remove('section-hidden');
                pres.classList.add('section-reveal');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 7. Gestione Modali---
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('[id^="modal-"]:not(.hidden)').forEach(m => window.closeModal(m.id));
        }
    });

    // --- 8. Research Scroll Dots  ---
    const researchScroll = document.getElementById('research-scroll');
    if (researchScroll) {
        const updateDots = throttle(() => {
            const dots = document.querySelectorAll('.scroll-dot');
            if (!dots.length) return;
            
            const card = researchScroll.querySelector('article');
            if (!card) return;
            const step = card.offsetWidth + 24; // larghezza card + gap-6
            const index = Math.round(researchScroll.scrollLeft / step);
            const activeIndex = Math.min(index, dots.length - 1);
            
            dots.forEach((dot, i) => {
                const isActive = i === activeIndex;
                dot.classList.toggle('bg-gold', isActive);
                dot.classList.toggle('scale-110', isActive);
                dot.classList.toggle('bg-white/20', !isActive);
            });
        }, 50);
        researchScroll.addEventListener('scroll', updateDots, { passive: true });
        updateDots();
    }

    // --- 9. Cursor Glow  ---
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.setAttribute('aria-hidden', 'true');
        document.documentElement.appendChild(glow);
        
        document.addEventListener('mousemove', e => {
            document.documentElement.style.setProperty('--mx', e.clientX + 'px');
            document.documentElement.style.setProperty('--my', e.clientY + 'px');
        }, { passive: true });
    }
});
