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
    // 5. ПРОСМОТР ДИПЛОМОВ (Lightbox)
    // =========================================================================
    const lightbox = document.getElementById('diploma-lightbox') || document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-target-img') || document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('close-lightbox');
    const triggers = document.querySelectorAll('.lightbox-trigger, .view-diploma-link');

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.add('opacity-0', 'pointer-events-none', 'hidden');
        document.body.style.overflow = ''; 
        document.body.classList.remove('overflow-hidden');
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = ''; 
        }, 300);
    }

    window.openLightbox = function(src) {
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightbox.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            lightbox.classList.add('flex');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeLightbox = closeLightbox;

    triggers.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const src = element.getAttribute('src') || element.getAttribute('href') || element.dataset.src;
            if (src) window.openLightbox(src);
        });
    });

    closeBtn?.addEventListener('click', closeLightbox);
    
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('bg-black/80') || e.target.id === 'diploma-lightbox') {
            closeLightbox();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
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
