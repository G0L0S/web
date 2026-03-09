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

// Telegram Bot Integration
const BOT_TOKEN_BASE64 = "ODQzMDkzNjAyMjpBQUdjQUd2R0FNdGVqX2p2ekNmU2h5eWY1WjU2LW1QYnBNTQ==";
const botToken = atob(BOT_TOKEN_BASE64);

// ВАЖНО: Укажите здесь ваш CHAT_ID, куда бот будет отправлять сообщения
// Узнать свой CHAT_ID можно у бота @userinfobot в Telegram
const CHAT_ID = "665087825"; 

async function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('[name="name"]').value;
    const contact = form.querySelector('[name="contact"]').value;
    const format = form.querySelector('[name="format"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const message = `🎵 *Новая заявка с сайта!*\n\n*Имя:* ${name}\n*Контакты:* ${contact}\n*Формат:* ${format}`;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (response.ok) {
            alert('Спасибо за заявку! Я свяжусь с вами в ближайшее время.');
            form.reset();
        } else {
            const data = await response.json();
            if (data.description && data.description.includes('chat not found')) {
                alert('Ошибка: Не настроен CHAT_ID. Пожалуйста, укажите ваш CHAT_ID в коде сайта.');
            } else {
                alert('Произошла ошибка при отправке. Пожалуйста, попробуйте позже.');
            }
        }
    } catch (error) {
        alert('Произошла ошибка при отправке. Проверьте подключение к интернету.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
    }
}

// Make submitForm available globally
window.submitForm = submitForm;
