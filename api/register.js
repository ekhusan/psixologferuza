export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ism, familiya, telefon } = req.body;

  if (!ism || !familiya || !telefon) {
    return res.status(400).json({ error: 'Barcha maydonlar kerak' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = process.env.TELEGRAM_CHAT_IDS.split(',').map(id => id.trim());

  const text =
    `<b>Yangi lid!</b>\n\n` +
    `<b>Familiya va Ismi:</b>\n${familiya} ${ism}\n` +
    `<b>Tel:</b>\n${telefon}\n` +
    `<b>Ro\u02BBxatdan o\u02BBtgan vaqti:</b>\n${new Date().toLocaleString('uz-UZ')}`;

  try {
    await Promise.all(
      chatIds.map(chatId =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
        })
      )
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Telegram xatosi' });
  }
}
