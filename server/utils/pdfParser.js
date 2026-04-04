// const pdfParse = require('pdf-parse/lib/pdf-parse.js');

// const extractText = async (buffer) => {
//   const data = await pdfParse(buffer);
//   return data.text;
// };

// module.exports = { extractText };


const { PdfReader } = require('pdfreader');

const extractText = (buffer) => {
  return new Promise((resolve, reject) => {
    const reader = new PdfReader();
    let text = '';
    reader.parseBuffer(buffer, (err, item) => {
      if (err) reject(err);
      else if (!item) resolve(text);
      else if (item.text) text += item.text + ' ';
    });
  });
};

module.exports = { extractText };