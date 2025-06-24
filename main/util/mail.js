import { createTransport } from 'nodemailer';
/**
 * @import { Options } from 'nodemailer/lib/mailer';
 * @import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
 */

const transporter = createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    }
});

/**
 * @param { Options } mailOptions
 * @returns { Promise<SentMessageInfo> }
 */
export function sendMail(mailOptions) {
    return transporter.sendMail(mailOptions);
}

