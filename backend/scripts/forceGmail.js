const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');

try {
    let content = fs.readFileSync(envPath, 'utf8');

    // Replace Host
    if (content.includes('SMTP_HOST=')) {
        content = content.replace(/SMTP_HOST=.*/, 'SMTP_HOST=smtp.gmail.com');
    } else {
        content += '\nSMTP_HOST=smtp.gmail.com';
    }

    // Replace Port
    if (content.includes('SMTP_PORT=')) {
        content = content.replace(/SMTP_PORT=.*/, 'SMTP_PORT=587');
    } else {
        content += '\nSMTP_PORT=587';
    }

    fs.writeFileSync(envPath, content);
    console.log('Force verified: SMTP_HOST=smtp.gmail.com and SMTP_PORT=587');

} catch (err) {
    console.error('Error updating .env:', err);
}
