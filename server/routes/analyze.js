const express = require('express');
const multer = require('multer');
const { extractText } = require('../utils/pdfParser');
const Groq = require('groq-sdk');
require('dotenv').config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const resumeText = await extractText(req.file.buffer);
    const jobRole = req.body.jobRole || 'Software Developer';

    const prompt = `
      You are an expert resume reviewer.
      Analyze this resume for a ${jobRole} position.
      Resume content: ${resumeText.slice(0, 3000)}

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

module.exports = router;