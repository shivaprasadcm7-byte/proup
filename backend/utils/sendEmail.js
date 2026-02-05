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
            // Allow less secure TLS versions for compatibility
            rejectUnauthorized: false
        }
    });

    // Define email options
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.SMTP_EMAIL}>`, // Use actual SMTP email as sender
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
