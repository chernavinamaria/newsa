import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
console.log('Keys:', Object.keys(pdf));
console.log('Type:', typeof pdf);
// If it's a function, it might just not be exported as default in ESM
if (typeof pdf === 'function') {
  console.log('PDF-PARSE IS A FUNCTION');
} else if (typeof pdf.default === 'function') {
  console.log('PDF-PARSE.DEFAULT IS A FUNCTION');
}
