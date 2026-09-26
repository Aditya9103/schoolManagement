/**
 * emailTemplates.js — Responsive, high-contrast HTML email templates for Brevo dispatch.
 * Styled with PrimeSchoolOs royal blue & gold accents.
 */

/**
 * Generates an OTP verification email HTML.
 *
 * @param {Object} params
 * @param {string} params.otp - 6-digit OTP code
 * @param {string} [params.purpose='LOGIN'] - Purpose of OTP
 * @param {number} [params.expiryMinutes=10] - Expiration duration
 * @param {string} [params.schoolName='PrimeSchoolOs'] - School or platform name
 * @returns {string} Complete HTML string
 */
export const otpEmailTemplate = ({
    otp,
    purpose = 'LOGIN',
    expiryMinutes = 10,
    schoolName = 'PrimeSchoolOs',
}) => {
    const purposeText =
        purpose === 'LOGIN'
            ? 'Sign in to your account'
            : purpose === 'REGISTER'
            ? 'Verify your new account registration'
            : purpose === 'FORGOT_PASSWORD'
            ? 'Reset your password'
            : 'Account Verification';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Verification Code</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 36px 32px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .logo-text span { color: #f59e0b; }
    .tagline { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; }
    .content { padding: 36px 32px; }
    .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 8px; text-align: center; }
    .subtitle { font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 28px; text-align: center; line-height: 1.5; }
    .otp-card { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px; }
    .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #1d4ed8; margin: 0; font-family: 'Courier New', Courier, monospace; }
    .otp-expiry { font-size: 12px; color: #64748b; margin-top: 10px; margin-bottom: 0; font-weight: 500; }
    .warning { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 14px 16px; border-radius: 6px; margin-bottom: 24px; }
    .warning p { margin: 0; font-size: 12px; color: #1e40af; line-height: 1.5; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center; }
    .footer p { margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo-text">PrimeSchool<span>Os</span></h1>
      <div class="tagline">Smart School Management</div>
    </div>
    <div class="content">
      <h2 class="title">${schoolName}</h2>
      <p class="subtitle">Use the verification code below to ${purposeText}.</p>
      
      <div class="otp-card">
        <p class="otp-code">${otp}</p>
        <p class="otp-expiry">⏱️ Valid for the next ${expiryMinutes} minutes</p>
      </div>

      <div class="warning">
        <p><strong>Security Tip:</strong> Never share this OTP with anyone, including school staff. PrimeSchoolOs will never ask for your verification code.</p>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0; text-align: center;">
        If you did not request this verification code, please ignore this email or contact your school administrator immediately.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} PrimeSchoolOs. All rights reserved.<br>Empowering schools to create a better tomorrow.</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Generates a full, rich welcome & activation email for newly onboarded School Admins or Staff.
 */
export const welcomeEmailTemplate = ({
    name,
    userName,
    role = 'School Administrator',
    schoolName = 'PrimeSchoolOs',
    email,
    loginUrl,
    setupUrl,
    temporaryPassword = 'Password@123',
}) => {
    const displayName = name || userName || 'Administrator';
    const actionUrl = setupUrl || loginUrl || 'http://localhost:5173/auth/login';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${schoolName} on PrimeSchoolOs</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 36px 32px; text-align: center; }
    .logo-text { color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
    .logo-text span { color: #f59e0b; }
    .tagline { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; }
    .badge { display: inline-block; background: rgba(255, 255, 255, 0.12); color: #93c5fd; padding: 4px 12px; border-radius: 9999px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 12px; border: 1px solid rgba(255, 255, 255, 0.2); }
    .content { padding: 36px 32px; color: #1e293b; }
    .salutation { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
    .intro { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
    .details-card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 20px; margin-bottom: 26px; }
    .details-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #1e40af; margin-top: 0; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    .details-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
    .details-label { color: #64748b; font-weight: 500; }
    .details-value { color: #0f172a; font-weight: 700; text-align: right; }
    .code-pill { background: #e0e7ff; color: #3730a3; padding: 3px 8px; border-radius: 6px; font-family: 'Courier New', Courier, monospace; font-size: 13px; font-weight: 700; }
    .cta-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; padding: 15px 34px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); }
    .instructions { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 12px; color: #1e40af; line-height: 1.6; }
    .instructions ol { margin: 6px 0 0 0; padding-left: 18px; }
    .instructions li { margin-bottom: 4px; }
    .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center; }
    .footer p { margin: 0; font-size: 11px; color: #94a3b8; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo-text">PrimeSchool<span>Os</span></h1>
      <div class="tagline">Enterprise School Management Platform</div>
      <div class="badge">Official Administrator Invitation</div>
    </div>
    <div class="content">
      <h2 class="salutation">Hello ${displayName},</h2>
      <p class="intro">
        You have been officially invited by the platform Super Administrator to onboard and manage <strong>${schoolName}</strong> on PrimeSchoolOs.
      </p>

      <div class="details-card">
        <div class="details-title">Your Tenant &amp; Access Details</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">School / Institution:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${schoolName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Assigned Role:</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${role}</td>
          </tr>
          ${email ? `
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Login ID (Email):</td>
            <td style="padding: 6px 0; color: #0f172a; font-weight: 700; text-align: right;">${email}</td>
          </tr>` : ''}
          ${temporaryPassword ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Temporary Password:</td>
            <td style="padding: 6px 0; text-align: right;"><span class="code-pill">${temporaryPassword}</span></td>
          </tr>` : ''}
        </table>
      </div>

      <div class="cta-container">
        <a href="${actionUrl}" class="btn" target="_blank">Activate Account &amp; Set Password</a>
        <p style="font-size: 11px; color: #94a3b8; margin-top: 10px;">
          Link active for 48 hours. If the button doesn't work, copy this link into your browser:<br>
          <a href="${actionUrl}" style="color: #2563eb; word-break: break-all;">${actionUrl}</a>
        </p>
      </div>

      <div class="instructions">
        <strong>Getting Started is Simple:</strong>
        <ol>
          <li>Click the <strong>Activate Account &amp; Set Password</strong> button above.</li>
          <li>Sign in using your email${temporaryPassword ? ` and temporary password (<span class="code-pill">${temporaryPassword}</span>)` : ''}, or request a secure OTP to your email.</li>
          <li>Once logged in, go to your profile settings to set your permanent custom password.</li>
        </ol>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 0; text-align: center;">
        If you have any questions or did not expect this invitation, please contact your platform administrator.
      </p>
    </div>
    <div class="footer">
      <p>
        Secured by Brevo Transactional SMTP &amp; 256-bit encrypted authentication.<br>
        &copy; ${new Date().getFullYear()} PrimeSchoolOs. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
};
