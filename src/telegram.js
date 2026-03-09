// Telegram Bot Integration
const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;

// ВАЖНО: Укажите здесь ваш CHAT_ID, куда бот будет отправлять сообщения
// Узнать свой CHAT_ID можно у бота @userinfobot в Telegram
const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

export async function submitForm(event) {
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
