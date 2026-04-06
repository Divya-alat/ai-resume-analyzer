const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.get('/', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const jobRole = req.body.jobRole || 'Software Developer';

    // Extract text from PDF
    let resumeText = '';
    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(req.file.buffer);
      resumeText = data.text.slice(0, 3000);
    } catch (pdfErr) {
      resumeText = req.file.buffer
        .toString('utf-8')
        .replace(/[^\x20-\x7E\n]/g, ' ')
        .slice(0, 3000);
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        error: 'Could not read PDF text. Try a different PDF file.'
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      You are an expert resume reviewer.
      Analyze this resume for a ${jobRole} position.
      Resume content: ${resumeText}

      Return ONLY a valid JSON object with no extra text, no markdown, no backticks:
      {
        "score": (number out of 100),
        "strengths": ["strength1", "strength2", "strength3"],
        "improvements": ["improvement1", "improvement2", "improvement3"],
        "missingKeywords": ["keyword1", "keyword2", "keyword3"],
        "summary": "2 line overall summary"
      }
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content;
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json(parsed);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;