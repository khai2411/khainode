window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    htmlElement.classList.add('dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
} else {
    htmlElement.classList.remove('dark');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
}
themeToggle.addEventListener('click', () => {
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        localStorage.theme = 'light';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        htmlElement.classList.add('dark');
        localStorage.theme = 'dark';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function trapFocus(container, e) {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(el => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}
function openMobileMenu() {
    mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
    mobileMenu.setAttribute('aria-hidden', 'false');
    const firstLink = mobileMenu.querySelector(FOCUSABLE_SELECTOR);
    if (firstLink) firstLink.focus();
    document.addEventListener('keydown', handleMobileMenuKeydown);
}
function closeMobileMenu() {
    mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleMobileMenuKeydown);
    mobileMenuBtn.focus();
}
function handleMobileMenuKeydown(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
        return;
    }
    trapFocus(mobileMenu, e);
}
mobileMenuBtn.addEventListener('click', openMobileMenu);
closeMenuBtn.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});
const issuerFilterLinks = document.querySelectorAll('.issuer-filter');
const certificateItems = document.querySelectorAll('#projects-grid .project-item');
issuerFilterLinks.forEach(link => {
    link.addEventListener('click', () => {
        const issuer = link.getAttribute('data-issuer-filter');
        certificateItems.forEach(item => {
            const itemIssuer = item.getAttribute('data-issuer') || '';
            item.style.display = itemIssuer === issuer ? '' : 'none';
        });
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
    });
});
const allCertificatesLink = document.getElementById('all-certificates-link');
if (allCertificatesLink) {
    allCertificatesLink.addEventListener('click', () => {
        certificateItems.forEach(item => { item.style.display = ''; });
    });
}
function updateLocalTime() {
    const timeEl = document.getElementById('local-time');
    if (timeEl) {
        const now = new Date();
        const options = { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        timeEl.textContent = new Intl.DateTimeFormat([], options).format(now);
    }
}
setInterval(updateLocalTime, 1000);
updateLocalTime();
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}
const modal = document.getElementById('project-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');
const triggers = document.querySelectorAll('.project-trigger');
let lastModalTrigger = null;
function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeProjectModal();
        return;
    }
    trapFocus(modalContent, e);
}
triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const title = trigger.getAttribute('data-title');
        const category = trigger.getAttribute('data-category');
        const image = trigger.getAttribute('data-image');
        const desc = trigger.getAttribute('data-desc');
        const type = trigger.getAttribute('data-type');
        const month = trigger.getAttribute('data-month');
        const validity = trigger.getAttribute('data-validity') || 'Tidak ditentukan';
        const issuer = trigger.getAttribute('data-issuer') || 'Tidak ditentukan';
        const recipient = trigger.getAttribute('data-recipient') || 'Khairul huda';
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-category').textContent = category;
        document.getElementById('modal-image').src = image;
        document.getElementById('modal-desc').textContent = desc;
        document.getElementById('modal-type').textContent = type;
        document.getElementById('modal-month').textContent = month;
        document.getElementById('modal-validity').textContent = validity;
        document.getElementById('modal-issuer').textContent = issuer;
        document.getElementById('modal-recipient').textContent = recipient;
        lastModalTrigger = trigger;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', handleModalKeydown);
        setTimeout(() => {
            modalBackdrop.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95', 'opacity-0');
            closeModal.focus();
        }, 10);
    });
});
function closeProjectModal() {
    modalBackdrop.classList.add('opacity-0');
    modalContent.classList.add('scale-95', 'opacity-0');
    document.removeEventListener('keydown', handleModalKeydown);
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        if (lastModalTrigger) lastModalTrigger.focus();
    }, 300);
}
closeModal.addEventListener('click', closeProjectModal);
modalBackdrop.addEventListener('click', closeProjectModal);
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        scrollToTopBtn.classList.remove('translate-y-20', 'opacity-0');
    } else {
        scrollToTopBtn.classList.add('translate-y-20', 'opacity-0');
    }
});
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
const cards = document.querySelectorAll('.spotlight-card');
cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});