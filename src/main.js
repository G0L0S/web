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
