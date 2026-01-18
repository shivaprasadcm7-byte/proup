const sendEmail = require('../utils/sendEmail');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const test = async () => {
    console.log('Attempting to send test email...');

    if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.error('Error: SMTP credentials are missing in .env file.');
        console.log('Please ensure SMTP_HOST, SMTP_EMAIL, and SMTP_PASSWORD are set.');
        return;
    }

    console.log('Using SMTP Host:', process.env.SMTP_HOST);

    const recipient = process.env.SMTP_EMAIL; // Send to the sender's email to ensure they get it
    console.log(`Sending test email to: ${recipient}`);

    try {
        await sendEmail({
            email: recipient,
            subject: 'Test Email from Proup',
            message: 'This is a test email from Proup backend. If you see this, your SMTP matches are working!',
        });
        console.log(`Email sent successfully to ${recipient}!`);
        console.log('Please check your Spam/Junk folder if you do not see it in Inbox.');
    } catch (err) {
        console.error('Failed to send email:', err);
    }
};

test();


