import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function run() {
  let pdf;
  try {
    pdf = require('pdf-parse');
  } catch (e) {
    console.error('Failed to require pdf-parse:', e.message);
    return;
  }

  const pdfDir = 'C:/ai/SA/Сайт';
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));

  for (const file of files) {
    console.log(`\n\n====================\nFILE: ${file}\n====================\n`);
    const dataBuffer = fs.readFileSync(path.join(pdfDir, file));
    try {
      // Trying with 'new' as per error message
      let data;
      if (typeof pdf === 'function') {
        data = await pdf(dataBuffer);
      } else if (typeof pdf.PDFParse === 'function') {
        // Some versions/environments require calling it differently or it's a class
        try {
          data = await pdf.PDFParse(dataBuffer);
        } catch (err) {
           // Fallback to constructor
           const parser = new pdf.PDFParse();
           data = await parser.parse(dataBuffer); 
        }
      } else {
         console.error('Could not find a valid parse function');
         continue;
      }
      console.log(data.text);
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  }
}

run();
