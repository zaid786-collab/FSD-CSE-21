import nodemailer from 'nodemailer';

export function getEmailConfig() {
  const host = process.env.EMAIL_HOST || process.env.SMTP_HOST || '';
  const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '587', 10);
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || '';
  const pass = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS || '';
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || (user ? `"Mohammad Zaid Khan" <${user}>` : '"Portfolio Contact" <no-reply@mohammadzaidkhan.dev>');
  const to = process.env.EMAIL_TO || process.env.NOTIFICATION_EMAIL || 'zaidkhan24082006@gmail.com';
  const secure = process.env.EMAIL_SECURE === 'true' || port === 465;

  return { host, port, user, pass, from, to, secure };
}

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  isConfigured() {
    const { host, user, pass } = getEmailConfig();
    return Boolean(host && user && pass);
  }

  initTransporter() {
    const config = getEmailConfig();
    if (this.isConfigured()) {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      });
    } else {
      this.transporter = null;
    }
  }

  /**
   * Verify SMTP connection status
   */
  async verifyConnection() {
    this.initTransporter();
    const config = getEmailConfig();

    if (!this.isConfigured() || !this.transporter) {
      return {
        configured: false,
        verified: false,
        message: 'Email service credentials not configured. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD.'
      };
    }

    try {
      await this.transporter.verify();
      return {
        configured: true,
        verified: true,
        message: `SMTP connection established successfully to ${config.host}:${config.port}`
      };
    } catch (err) {
      return {
        configured: true,
        verified: false,
        message: `SMTP connection failed: ${err.message}`
      };
    }
  }

  /**
   * Send notification to portfolio owner
   */
  async sendContactNotification(submission) {
    this.initTransporter();
    const config = getEmailConfig();

    if (!this.isConfigured() || !this.transporter) {
      console.warn('[EMAIL SERVICE] Missing SMTP configuration. Owner email notification cannot be dispatched.');
      return {
        sent: false,
        reason: 'unconfigured',
        message: 'Email service credentials not configured.'
      };
    }

    const { name, email, company, phone, purpose, subject, message, createdAt } = submission;
    const submissionTime = createdAt ? new Date(createdAt).toUTCString() : new Date().toUTCString();

    const mailOptions = {
      from: config.from,
      to: config.to,
      replyTo: email,
      subject: `New Portfolio Contact Query: [${purpose}] ${subject}`,
      text: `New Portfolio Contact Query
========================================
Timestamp:    ${submissionTime}
Sender Name:  ${name}
Sender Email: ${email}
Company:      ${company || 'Not provided'}
Phone:        ${phone || 'Not provided'}
Purpose:      ${purpose}
Subject:      ${subject}
========================================
Message:
${message}
`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0f17; color: #f1f5f9; border-radius: 8px; border: 1px solid #1e293b;">
          <div style="border-bottom: 2px solid #60a5fa; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #60a5fa; margin: 0 0 6px 0; font-size: 20px;">New Portfolio Contact Query</h2>
            <span style="color: #94a3b8; font-size: 12px; font-family: monospace;">Received: ${submissionTime}</span>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
            <tr>
              <td style="padding: 8px 0; color: #94a3b8; width: 130px; font-weight: 500;">Sender Name:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #ffffff;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Sender Email:</td>
              <td style="padding: 8px 0; color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Company / Org:</td>
              <td style="padding: 8px 0; color: #e2e8f0;">${company || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Phone Number:</td>
              <td style="padding: 8px 0; color: #e2e8f0;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Purpose:</td>
              <td style="padding: 8px 0; color: #a78bfa; font-weight: 600;">${purpose}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #94a3b8;">Subject:</td>
              <td style="padding: 8px 0; color: #e2e8f0; font-weight: 600;">${subject}</td>
            </tr>
          </table>

          <div style="background: #111827; padding: 18px; border-radius: 6px; border-left: 3px solid #60a5fa; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #e2e8f0;">${message}</div>

          <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; text-align: center;">
            Dispatched securely via Mohammad Zaid Khan Portfolio Contact Pipeline
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL DISPATCH SUCCESS] Owner notification delivered. MessageId: ${info.messageId}`);
      return { sent: true, messageId: info.messageId };
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to deliver owner notification:', err.message);
      return { sent: false, reason: 'error', error: err.message };
    }
  }

  /**
   * Send automatic polite confirmation receipt to sender
   */
  async sendSenderAutoReply(submission) {
    this.initTransporter();
    const config = getEmailConfig();

    if (!this.isConfigured() || !this.transporter) {
      console.warn('[EMAIL SERVICE] Missing SMTP configuration. Sender auto-reply cannot be dispatched.');
      return {
        sent: false,
        reason: 'unconfigured',
        message: 'Email service credentials not configured.'
      };
    }

    const { name, email, subject, createdAt } = submission;
    const submissionTime = createdAt ? new Date(createdAt).toUTCString() : new Date().toUTCString();

    const mailOptions = {
      from: config.from,
      to: email,
      subject: `Thank you for reaching out: ${subject}`,
      text: `Hi ${name},

Thank you for reaching out through my portfolio. I have received your message regarding "${subject}" sent on ${submissionTime}.

I review all inquiries attentively and will get back to you as soon as possible.

Best regards,
Mohammad Zaid Khan
Software Engineer | Full-Stack Developer | Competitive Programmer
https://github.com/zaid786-collab
`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0b0f17; color: #f1f5f9; border-radius: 8px; border: 1px solid #1e293b;">
          <h3 style="color: #60a5fa; margin-top: 0; font-size: 18px;">Thank you for reaching out, ${name}!</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            I have received your message regarding <strong>"${subject}"</strong> submitted on <span style="color: #94a3b8;">${submissionTime}</span>.
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
            I prioritize technical inquiries, project collaborations, and professional opportunities, and will review your note and respond promptly.
          </p>
          <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
          <div style="font-size: 13px; color: #94a3b8;">
            <p style="margin: 2px 0; font-weight: 600; color: #f1f5f9;">Mohammad Zaid Khan</p>
            <p style="margin: 2px 0; color: #94a3b8;">Software Engineer | Full-Stack Developer | Competitive Programmer</p>
            <p style="margin: 2px 0; color: #64748b;">Noida, India &bull; <a href="https://github.com/zaid786-collab" style="color: #38bdf8; text-decoration: none;">GitHub</a></p>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL DISPATCH SUCCESS] Confirmation auto-reply delivered to ${email}. MessageId: ${info.messageId}`);
      return { sent: true, messageId: info.messageId };
    } catch (err) {
      console.error(`[EMAIL ERROR] Failed to deliver confirmation auto-reply to ${email}:`, err.message);
      return { sent: false, reason: 'error', error: err.message };
    }
  }
}

export const emailService = new EmailService();
