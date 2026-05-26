// ВСТАВИТЬ В ФАЙЛ src/main.js ПОСЛЕ ПОЛНОЙ ОЧИСТКИ ФАЙЛА
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
    // 4. МОДАЛЬНОЕ ОКНО ДЛЯ ЗАПИСИ (Консультация и Тренинги)
    // =========================================================================
    const modal = document.getElementById('callback-modal'); 
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    
    // Ищем кнопки по селекторам на сайте
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
        } else {
            alert('Здесь открывается окно обратной связи для записи!');
        }
    };

    window.toggleContactModal = function(show) {
        if (show) window.openContactModal();
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
    // 5. СОВРЕМЕННЫЙ АВТОНОМНЫЙ LIGHTBOX ДЛЯ ПРОСМОТРА ДИПЛОМОВ
    // =========================================================================
    const triggers = document.querySelectorAll('.lightbox-trigger, .view-diploma-link');
    let lightboxModal = null;
    let lightboxImg = null;

    // Функция создания модального окна динамически (без привязки к HTML)
    function createLightbox() {
        lightboxModal = document.createElement('div');
        lightboxModal.className = 'fixed inset-0 bg-stone-950/95 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300 pointer-events-none';
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'absolute top-6 right-6 text-white text-4xl font-light hover:text-warm-300 transition-colors cursor-pointer focus:outline-none select-none';
        
        lightboxImg = document.createElement('img');
        lightboxImg.className = 'max-w-full max-h-[85vh] object-contain transform scale-95 transition-transform duration-300 select-none rounded-lg shadow-2xl';
        
        // Защита от случайного скачивания и перетаскивания картинок
        lightboxImg.addEventListener('contextmenu', e => e.preventDefault());
        lightboxImg.addEventListener('dragstart', e => e.preventDefault());

        lightboxModal.appendChild(closeBtn);
        lightboxModal.appendChild(lightboxImg);
        document.body.appendChild(lightboxModal);

        // Закрытие при клике по фону или крестику
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target === closeBtn) {
                closeLightbox();
            }
        });

        // Закрытие по кнопке Escape
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxModal.classList.contains('opacity-100')) {
                closeLightbox();
            }
        });
    }

    function openLightbox(src, alt = 'Документ об образовании') {
        if (!lightboxModal) createLightbox();
        
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        
        document.body.style.overflow = 'hidden';
        
        lightboxModal.classList.remove('pointer-events-none', 'opacity-0');
        lightboxModal.classList.add('opacity-100');
        
        // Микротаймаут для срабатывания плавной анимации увеличения
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

    // Вешаем глобальные методы на случай, если вызов идет из инлайна
    window.openLightbox = (src) => openLightbox(src);
    window.closeLightbox = () => closeLightbox();

    // Привязываем клик ко всем миниатюрам на странице
    triggers.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const src = element.getAttribute('src') || element.getAttribute('href') || element.dataset.src;
            const alt = element.getAttribute('alt') || 'Документ';
            if (src) openLightbox(src, alt);
        });
    });


    // =========================================================================
    // 6. ОЧИЩЕННЫЙ НАТИВНЫЙ СЛАЙДЕР ОТЗЫВОВ
    // =========================================================================
    const track = document.getElementById('reviews-track') || document.getElementById('reviewTrack');
    const slides = track ? Array.from(track.children) : [];
    const dotsContainer = document.getElementById('reviews-dots');
    const prevBtn = document.getElementById('review-prev');
    const nextBtn = document.getElementById('review-next');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        if (dotsContainer) dotsContainer.innerHTML = '';

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-warm-600 w-6' : 'bg-warm-300 hover:bg-warm-400'}`;
            dot.setAttribute('aria-label', `Перейти к отзыву ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer?.appendChild(dot);
        }

        const dots = dotsContainer ? dotsContainer.children : [];

        function goToSlide(index) {
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            if (dots.length > 0) {
                Array.from(dots).forEach((dot, i) => {
                    if (i === currentIndex) {
                        dot.classList.remove('bg-warm-300', 'w-2.5');
                        dot.classList.add('bg-warm-600', 'w-6');
                    } else {
                        dot.classList.remove('bg-warm-600', 'w-6');
                        dot.classList.add('bg-warm-300', 'w-2.5');
                    }
                });
            }
        }

        window.moveSlide = function(direction) {
            goToSlide(currentIndex + direction);
        };

        prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                goToSlide(currentIndex + 1);
            } else if (touchEndX - touchStartX > swipeThreshold) {
                goToSlide(currentIndex - 1);
            }
        }, { passive: true });
    }
});
