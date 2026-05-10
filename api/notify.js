import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const parsed = JSON.parse(raw);
    const settings = parsed.settings;

    if (!settings || !settings.botToken) {
      return res.status(200).json({ ok: true, note: 'No bot token configured' });
    }

    const formData = req.body;
    const text = `🔥 Yangi ariza (Isale.Marketing):\n\n👤 Ism: ${formData.name}\n📞 Tel: ${formData.phone}\n🌐 Insta: ${formData.insta || '-'}\n🎯 Soha: ${formData.niche}\n💰 Byudjet: ${formData.budget}\n🚀 Maqsad: ${formData.goal}`;
    
    const apiUrl = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;

    const sendTo = async (chatId) => {
      if (!chatId) return;
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
      });
    };

    await sendTo(settings.chatId1);
    await sendTo(settings.chatId2);

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}
