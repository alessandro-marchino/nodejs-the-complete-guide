import { createTransport } from 'nodemailer';
/**
 * @import { Options } from 'nodemailer/lib/mailer';
 * @import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
 */

const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: +process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

/**
 * @param { Options } mailOptions
 * @returns { Promise<SentMessageInfo> }
 */
export function sendMail(mailOptions) {
  if(process.env.EMAIL_MOCK === 'true') {
    console.log(`MOCK sending mail: ${mailOptions}`);
    return Promise.resolve({});
  }
  return transporter.sendMail(mailOptions);
}

