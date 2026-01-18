const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

try {
    let content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');

    const newLines = lines.map(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join('=').trim();

            // Remove \r if present
            value = value.replace(/\r/g, '');

            if (key === 'SMTP_PASSWORD') {
                // Remove all spaces for password
                const originalLength = value.length;
                value = value.replace(/\s/g, '');
                console.log(`cleaned SMTP_PASSWORD: length ${originalLength} -> ${value.length}`);
            }
            return `${key}=${value}`;
        }
        return line;
    });

    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log('.env file has been sanitized.');
} catch (err) {
    console.error('Error cleaning .env:', err);
}


