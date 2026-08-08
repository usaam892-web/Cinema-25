import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Gemini AI endpoint for Movie & Anime recommendations
  app.post('/api/gemini/recommend', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'مفتاح Gemini API غير متاح في النظام',
        });
      }

      const { prompt, genre, type } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `أنت مساعد سينمائي ذكي وخبير في الأفلام والمسلسلات والأنمي باسم "سينما روبوت".
      أجب باللغة العربية بدقة وأسلوب مشوق ورائع.
      عند تقديم التوصيات، اقترح 3 إلى 5 أعمال تناسب الطلب مع وضع:
      1. اسم العمل بالعربي وبالإنجليزي
      2. النوع (فيلم / مسلسل / أنمي)
      3. التقييم والقصة باختصار شديد
      4. سبب التوصية.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemInstruction}\n\nطلب المستخدم: ${prompt || 'اقترح لي أعمال ممتازة'} | التصنيف: ${genre || 'الكل'} | النوع: ${type || 'الكل'}`,
              },
            ],
          },
        ],
      });

      const text = response.text || 'عذراً، لم أتمكن من الحصول على اقتراحات حالياً.';
      res.json({ result: text });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      res.status(500).json({
        error: 'حدث خطأ أثناء الاتصال بمساعد الذكاء الاصطناعي',
        details: err?.message || 'Unknown error',
      });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'MovieHub Stream & Download' });
  });

  // Helper to locate standalone HTML template
  const getTemplatePath = () => {
    const candidates = [
      path.join(process.cwd(), 'public', 'standalone.html'),
      path.join(process.cwd(), 'dist', 'standalone.html'),
      path.join(__dirname, 'public', 'standalone.html'),
      path.join(__dirname, '..', 'public', 'standalone.html'),
      path.join(__dirname, 'standalone.html'),
    ];
    for (const file of candidates) {
      if (fs.existsSync(file)) return file;
    }
    return null;
  };

  // Serve standalone template file directly
  app.get('/standalone.html', (req, res) => {
    const filePath = getTemplatePath();
    if (filePath) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.sendFile(filePath);
    } else {
      res.status(404).send('الصفحة غير موجودة');
    }
  });

  // Download standalone template file as an HTML attachment
  app.get('/download-template', (req, res) => {
    const filePath = getTemplatePath();
    if (filePath) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="cinemax_template.html"');
      res.sendFile(filePath);
    } else {
      res.status(404).send('ملف القالب غير موجود');
    }
  });

  // Vite middleware for dev or static server for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
