const fs = require('fs');
const path = require('path');

const extractText = async (buffer) => {
  try {
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    const data = await pdfParse(buffer);
    return data.text;
  } catch (err) {
    console.error('PDF parse error:', err);
    throw new Error('Failed to parse PDF');
  }
};

module.exports = { extractText };