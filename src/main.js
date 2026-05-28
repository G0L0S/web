import { submitForm } from './telegram.js';

// Делаем отправку формы доступной глобально
window.submitForm = submitForm;

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. АНИМАЦИИ AOS
    // =========================================================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });
    }

    // =========================================================================
    // 2. МОБИЛЬНОЕ МЕНЮ (НАВИГАЦИЯ)
    // =========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // =========================================================================
    // 3. ЭФФЕКТ СКРОЛЛА NAVBAR
    // =========================================================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('shadow-sm');
                navbar.classList.replace('py-4', 'py-2');
            } else {
                navbar.classList.remove('shadow-sm');
                navbar.classList.replace('py-2', 'py-4');
            }
        });
    }

    // =========================================================================
    // 4. МОДАЛЬНОЕ ОКНО ДЛЯ ЗАПИСИ
    // =========================================================================
    const modal = document.getElementById('callback-modal'); 
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const openModalBtns = document.querySelectorAll([
        '[href="#modal"]', 
        '.btn-record', 
        '[id^="record-"]',
        'button[class*="consultation"]'
    ].join(','));

    window.openContactModal = function(e) {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    };

    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    }

    openModalBtns.forEach(btn => btn.addEventListener('click', window.openContactModal));
    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // =========================================================================
    // 5. АВТОНОМНЫЙ LIGHTBOX ДЛЯ ПРОСМОТРА ДИПЛОМОВ
    // =========================================================================
    const triggers = document.querySelectorAll('.lightbox-trigger');
    let lightboxModal = null;
    let lightboxImg = null;

    function createLightbox() {
        lightboxModal = document.createElement('div');
        lightboxModal.className = 'fixed inset-0 bg-stone-950/95 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300 pointer-events-none';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'absolute top-6 right-6 text-white text-4xl font-light hover:text-warm-300 transition-colors cursor-pointer focus:outline-none select-none';
        
        lightboxImg = document.createElement('img');
        lightboxImg.className = 'max-w-full max-h-[85vh] object-contain transform scale-95 transition-transform duration-300 select-none rounded-lg shadow-2xl';
        
        lightboxImg.addEventListener('contextmenu', e => e.preventDefault());
        lightboxImg.addEventListener('dragstart', e => e.preventDefault());

        lightboxModal.appendChild(closeBtn);
        lightboxModal.appendChild(lightboxImg);
        document.body.appendChild(lightboxModal);

        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target === closeBtn) closeLightbox();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('opacity-100')) closeLightbox();
        });
    }

    function openLightbox(src, alt) {
        if (!lightboxModal) createLightbox();
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Документ об образовании';
        document.body.style.overflow = 'hidden';
        lightboxModal.classList.remove('pointer-events-none', 'opacity-0');
        lightboxModal.classList.add('opacity-100');
        setTimeout(() => lightboxImg.classList.remove('scale-95'), 10);
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('opacity-100');
        lightboxModal.classList.add('opacity-0', 'pointer-events-none');
        lightboxImg.classList.add('scale-95');
        setTimeout(() => {
            document.body.style.overflow = '';
            if (lightboxImg) lightboxImg.src = '';
        }, 300);
    }

    triggers.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const src = element.getAttribute('src') || element.getAttribute('href') || element.dataset.src;
            const alt = element.getAttribute('alt');
            if (src) openLightbox(src, alt);
        });
    });

    // =========================================================================
    // 6. АДАПТИВНЫЙ ГОРИЗОНТАЛЬНЫЙ СЛАЙДЕР ОТЗЫВОВ (Vite + Tailwind)
    // =========================================================================
    const track = document.getElementById('reviews-track');
    const dotsContainer = document.getElementById('reviews-dots');
    const prevBtn = document.getElementById('review-prev');
    const nextBtn = document.getElementById('review-next');
    
    if (track && dotsContainer) {
        const slides = Array.from(track.children);
        const totalSlides = slides.length;
        let currentIndex = 0;

        // Очищаем старые точки перед генерацией новых
        dotsContainer.innerHTML = '';

        // Динамическое создание точек-индикаторов
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === 0 ? 'bg-warm-900 w-6' : 'bg-warm-300 hover:bg-warm-400'
            }`;
            dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
            dot.addEventListener('click', () => updateSlider(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        // Функция обновления положения слайдера
        function updateSlider(index) {
            currentIndex = index;
            
            // Смещаем ленту по оси X
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Обновляем визуальное состояние точек
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-warm-900 w-6';
                } else {
                    dot.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 bg-warm-300 hover:bg-warm-400';
                }
            });
        }

        // Обработчики для стрелок навигации
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const index = (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlider(index);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const index = (currentIndex + 1) % totalSlides;
                updateSlider(index);
            });
        }

        // Поддержка свайпов на смартфонах
        let startX = 0;
        track.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', e => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) { // порог для свайпа
                const nextIndex = diff > 0 
                    ? (currentIndex + 1) % totalSlides 
                    : (currentIndex - 1 + totalSlides) % totalSlides;
                updateSlider(nextIndex);
            }
        }, { passive: true });
    }
});
