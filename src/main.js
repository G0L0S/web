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
