const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analyzeRoute = require('./routes/analyze');

const app = express();

// Fix CORS
app.use(cors({
  origin: 'https://ai-resume-analyzer-omega-rouge.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'multipart/form-data']
}));

app.use(express.json());
app.use('/api', analyzeRoute);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;