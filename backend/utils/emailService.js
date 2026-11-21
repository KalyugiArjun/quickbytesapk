import nodemailer from 'nodemailer';

// Create reusable transporter with graceful mock fallback
export const sendEmail = async (options) => {
  // If SMTP is not properly configured, log to console gracefully
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || user === 'test') {
    console.log(`[QuickBite Email Service: Mock Mode]`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message Preview: ${options.text || options.html?.slice(0, 100)}...`);
    return { success: true, mocked: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const message = {
      from: `${process.env.FROM_NAME || 'QuickBite'} <${process.env.FROM_EMAIL || 'noreply@quickbite.com'}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log(`[QuickBite Email Sent]: %s`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn(`[QuickBite Email Failed]: ${error.message} - falling back gracefully.`);
    return { success: false, error: error.message };
  }
};
