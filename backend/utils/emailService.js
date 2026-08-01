import nodemailer from "nodemailer";

let transporter = null;

export const getTransporter = async () => {
  if (transporter) return transporter;

  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = process.env.EMAIL_PORT;
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    console.log(`[SMTP SERVICE] Configured production SMTP Transporter for host: ${smtpHost}:${smtpPort || 587}`);
  } else {
    // If no SMTP credentials configured in env, create Ethereal SMTP test account for real SMTP message delivery
    console.log("[SMTP SERVICE] EMAIL_HOST/USER not found in .env. Initializing Ethereal SMTP server...");
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(`[SMTP SERVICE] Ethereal SMTP test account initialized: ${testAccount.user}`);
  }

  return transporter;
};

export const sendPasswordResetEmail = async ({ to, userName, resetUrl, resetOtp }) => {
  const mailTransporter = await getTransporter();
  const smtpFrom = process.env.EMAIL_FROM || '"VolunteerHub Support" <no-reply@volunteerhub.com>';

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
        .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 32px 24px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .content { padding: 32px 28px; color: #334155; line-height: 1.6; }
        .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1e293b; margin: 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 20px 0; text-align: center; }
        .footer { background: #f8fafc; padding: 20px 28px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
        .link-alt { word-break: break-all; color: #3b82f6; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>VolunteerHub</h1>
          <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Password Reset Request</p>
        </div>
        <div class="content">
          <p>Hello <strong>${userName || 'User'}</strong>,</p>
          <p>We received a request to reset the password for your VolunteerHub account. You can use either the button link below or enter your 6-digit OTP verification code.</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn" target="_blank">Reset Password Now</a>
          </div>

          <div class="otp-box">
            <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 0 0 6px 0;">Your Verification OTP Code</p>
            <div class="otp-code">${resetOtp}</div>
          </div>

          <p style="font-size: 13px; color: #64748b;">This reset link and OTP code are valid for <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8;">Or copy and paste this link in your browser:<br/>
            <a href="${resetUrl}" class="link-alt">${resetUrl}</a>
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} VolunteerHub. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: smtpFrom,
    to,
    subject: "VolunteerHub - Password Reset Code & Link",
    text: `You requested a password reset for VolunteerHub.\n\nYour OTP Code: ${resetOtp}\nReset Link: ${resetUrl}\n\nThis link/code is valid for 1 hour.`,
    html: htmlTemplate
  };

  const info = await mailTransporter.sendMail(mailOptions);
  console.log(`[SMTP EMAIL DELIVERED] Message ID: ${info.messageId} to ${to}`);

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[SMTP PREVIEW URL] View email online: ${previewUrl}`);
  }

  return info;
};
