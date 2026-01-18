const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const email = process.env.SMTP_EMAIL || '';
console.log(`Current Email: ${email}`);
console.log(`Current Host: ${process.env.SMTP_HOST}`);

if (email.includes('@gmail.com')) {
    console.log('DETECTED: GMAIL');
    if (process.env.SMTP_HOST !== 'smtp.gmail.com') {
        console.log('MISMATCH: Valid Gmail credentials need smtp.gmail.com');

        // Auto-fix
        let content = fs.readFileSync(envPath, 'utf8');
        content = content.replace(/SMTP_HOST=.*/, 'SMTP_HOST=smtp.gmail.com');
        content = content.replace(/SMTP_PORT=.*/, 'SMTP_PORT=587');
        fs.writeFileSync(envPath, content);
        console.log('FIXED: Updated .env to use smtp.gmail.com and port 587');
    } else {
        console.log('Host appears correct.');
    }
} else {
    console.log('Not a Gmail address or unable to detect.');
}


