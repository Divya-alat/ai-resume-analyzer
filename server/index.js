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

    // Simple text extraction without pdf-parse
    const resumeText = req.file.buffer
      .toString('latin1')
      .replace(/[^\x20-\x7E\n\r]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `
      You are an expert resume reviewer.
      Analyze this resume text for a ${jobRole} position.
      Resume content: ${resumeText}

      Return ONLY valid JSON, no markdown, no backticks:
      {
        "score": (number out of 100),
        "strengths": ["s1", "s2", "s3"],
        "improvements": ["i1", "i2", "i3"],
        "missingKeywords": ["k1", "k2", "k3"],
        "summary": "2 line summary"
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