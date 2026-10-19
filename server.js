const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  try {
    const code = req.get('x-access-code') || '';
    if (!process.env.ACCESS_CODE || code !== process.env.ACCESS_CODE) {
      return res.status(401).json({ error: 'رمز الدخول غير صحيح.' });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'الخادم يحتاج إعداد مفتاح Gemini من إعدادات الاستضافة.' });
    }
    const messages = Array.isArray(req.body.messages) ? req.body.messages.slice(-20) : [];
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 12000) }]
    }));
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'You are Malik AI, a direct, analytical, nonjudgmental assistant. Discuss topics openly and objectively, distinguish facts from opinions, and respond in the same language as the user.' }] },
        contents,
        generationConfig: { temperature: 0.6 }
      })
    });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data.error?.message || 'خطأ من مزود الذكاء الاصطناعي.' });
    const answer = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('') || 'ما وصلنيش رد من النموذج.';
    res.json({ answer });
  } catch (e) {
    res.status(500).json({ error: 'صار خطأ في الخادم. حاول مرة ثانية.' });
  }
});
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => console.log(`Malik AI running on ${port}`));
