/**
 * Vercel serverless: отправка заявки с сайта в Telegram.
 *
 * Настройка:
 * 1. Создайте бота в Telegram через @BotFather, скопируйте токен.
 * 2. Узнайте свой chat_id (напишите боту @userinfobot или откройте
 *    https://api.telegram.org/bot<TOKEN>/getUpdates после сообщения боту).
 * 3. В Vercel: Project → Settings → Environment Variables:
 *    TELEGRAM_BOT_TOKEN = токен бота
 *    TELEGRAM_CHAT_ID = ваш chat_id (число, например 123456789)
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ ok: false, error: 'Telegram not configured' });
  }

  const { name = '', phone = '', email = '', message = '' } = req.body || {};
  const text = [
    '🔄 *Новая заявка с сайта Alem Moving*',
    '',
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone}`,
    `✉️ Email: ${email}`,
    message ? `💬 Сообщение: ${message}` : ''
  ].filter(Boolean).join('\n');

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();

    if (!data.ok) {
      return res.status(400).json({ ok: false, error: data.description || 'Telegram error' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
