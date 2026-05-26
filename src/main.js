// Initialize AOS animations
AOS.init({
    once: true,
    offset: 50,
    duration: 800,
    easing: 'ease-out-cubic',
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on click
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('shadow-sm');
        navbar.classList.replace('py-4', 'py-2');
    } else {
        navbar.classList.remove('shadow-sm');
        navbar.classList.replace('py-2', 'py-4');
    }
});

import { submitForm } from './telegram.js';

// Make submitForm available globally
window.submitForm = submitForm;

// ===================================================
// ИНТЕРАКТИВНАЯ ЛОГИКА САЙТА (Адаптировано под Vite)
// ===================================================

// 1. Просмотр дипломов (Lightbox)
window.openLightbox = function(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (lb && img) {
    img.src = src;
    lb.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
};

window.closeLightbox = function() {
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
};

// 2. Слайдер отзывов
let currentIdx = 0;
let startX = 0;

window.moveSlide = function(direction) {
  const track = document.getElementById('reviewTrack');
  if (!track) return;
  
  const totalSlides = track.children.length;
  currentIdx = (currentIdx + direction + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentIdx * 100}%)`;
};

// Свайпы на смартфонах для карусели
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('reviewTrack');
  if (track) {
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        window.moveSlide(diff > 0 ? 1 : -1);
      }
    }, { passive: true });
  }
});

// 3. Заглушка для формы тренингов
window.toggleContactModal = function(show) {
  if (show) {
    alert('Здесь будет открываться модальное окно обратной связи для записи на тренинги!');
  }
};
// КЛИК-ЭФФЕКТ ДЛЯ ПРОСМОТРА ДИПЛОМОВ (LIGHTBOX)
document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('diploma-lightbox');
    const lightboxImg = document.getElementById('lightbox-target-img');
    const closeBtn = document.getElementById('close-lightbox');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    // Открытие лайтбокса при клике на картинку
    triggers.forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            const src = img.getAttribute('src');
            if (lightbox && lightboxImg) {
                lightboxImg.src = src;
                lightbox.classList.remove('opacity-0', 'pointer-events-none');
                document.body.style.overflow = 'hidden'; // Отключаем прокрутку страницы
            }
        });
    });

    // Функция закрытия окна
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = ''; // Возвращаем прокрутку страницы
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = ''; // Очищаем адрес после скрытия
        }, 300);
    }

    // Закрытие по крестику
    closeBtn?.addEventListener('click', closeLightbox);

    // Закрытие по клику на темную область вокруг картинки
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Закрытие по кнопке Escape на клавиатуре
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
});
// НАТИВНЫЙ АДАПТИВНЫЙ СЛАЙДЕР ОТЗЫВОВ
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('reviews-track');
    const slides = track ? track.children : [];
    const dotsContainer = document.getElementById('reviews-dots');
    const prevBtn = document.getElementById('review-prev');
    const nextBtn = document.getElementById('review-next');
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const totalSlides = slides.length;

    // 1. Динамически создаем точки-индикаторы
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = `w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === 0 ? 'bg-warm-600 w-6' : 'bg-warm-300 hover:bg-warm-400'}`;
        dot.setAttribute('aria-label', `Перейти к отзыву ${i + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.children;

    // 2. Функция перехода к нужному слайду
    function goToSlide(index) {
        // Зацикливание слайдера
        if (index < 0) {
            currentIndex = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        // Плавное смещение по оси X
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Обновление стилей активной точки
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

    // 3. Обработчики клика на стрелки
    prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));

    // 4. Поддержка свайпов для мобильных экранов (Touch события)
    let startX = 0;
    let endX = 0;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; // чувствительность свайпа в пикселях
        if (startX - endX > swipeThreshold) {
            goToSlide(currentIndex + 1); // Свайп влево -> следующий
        } else if (endX - startX > swipeThreshold) {
            goToSlide(currentIndex - 1); // Свайп вправо -> предыдущий
        }
    }
});
