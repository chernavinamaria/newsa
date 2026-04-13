const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const pdfDir = 'C:/ai/SA/Сайт';
const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));

async function extract() {
    for (const file of files) {
        console.log(`\n\n====================\nFILE: ${file}\n====================\n`);
        const filePath = path.join(pdfDir, file);
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            console.log(data.text);
        } catch (err) {
            console.error(`Error reading ${file}:`, err.message);
        }
    }
}

extract();
