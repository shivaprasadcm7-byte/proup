const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env vars
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

console.log('--- RAW ENV FILE ANALYSIS ---');
envLines.forEach((line, index) => {
    if (line.startsWith('SMTP_PASSWORD')) {
        const parts = line.split('=');
        if (parts.length > 1) {
            const val = parts.slice(1).join('=').trim(); // This trim might hide issues if reading manually, but let's see.
            // Actually, let's look at the raw line
            const rawVal = line.substring(line.indexOf('=') + 1);
            console.log(`Line ${index + 1}: SMTP_PASSWORD raw value length: ${rawVal.length}`);
            console.log(`First char code: ${rawVal.charCodeAt(0)}`);
            console.log(`Last char code: ${rawVal.charCodeAt(rawVal.length - 1)}`);
            if (rawVal.includes('\r')) console.log('Contains \\r');
            if (rawVal.includes(' ')) console.log('Contains Space');
        }
    }
});

dotenv.config({ path: envPath });

const debug = () => {
    console.log('\n--- PARSED PROCESS.ENV ANALYSIS ---');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);

    const pass = process.env.SMTP_PASSWORD;
    if (!pass) {
        console.log('SMTP_PASSWORD: MISSING');
    } else {
        console.log(`SMTP_PASSWORD length: ${pass.length}`);
        if (pass.length !== 16) {
            console.log('WARNING: Password is NOT 16 characters.');
        } else {
            console.log('Password is exactly 16 characters.');
        }
    }
};

debug();


