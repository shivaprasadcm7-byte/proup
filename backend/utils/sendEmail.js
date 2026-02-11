const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter with Gmail-compatible settings
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // Use STARTTLS (port 587)
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            // Only disable certificate verification in development
            rejectUnauthorized: process.env.NODE_ENV === 'production',
        }
    });

    // Define email options
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // Send email
    try {
        const info = await transporter.sendMail(message);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
