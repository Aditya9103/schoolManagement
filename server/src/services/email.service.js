import transporter from '../config/nodemailer.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import { otpEmailTemplate, welcomeEmailTemplate } from '../utils/emailTemplates.js';

/**
 * email.service.js — Email dispatch service via Brevo SMTP.
 */

/**
 * Send an email using the configured Brevo SMTP transporter.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @returns {Promise<any>}
 */
export const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: `"${env.smtp.from.includes('<') ? '' : 'PrimeSchoolOs'}" <${env.smtp.from}>`,
            to,
            subject,
            ...(text && { text }),
            ...(html && { html }),
        };

        const info = await transporter.sendMail(mailOptions);
        logger.info(`📧 Successfully sent email to ${to} (MessageID: ${info?.messageId || 'sent'})`);
        return info;
    } catch (error) {
        logger.error(`❌ Failed to send email to ${to}: ${error.message}`);
        throw error;
    }
};

/**
 * Send a branded OTP verification email using Brevo.
 *
 * @param {Object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.otp - 6-digit verification code
 * @param {string} [params.purpose='LOGIN'] - Purpose
 * @param {string} [params.schoolName] - School name
 * @param {number} [params.expiryMinutes=10] - Expiry minutes
 * @returns {Promise<any>}
 */
export const sendOtpEmail = async ({
    to,
    otp,
    purpose = 'LOGIN',
    schoolName = 'PrimeSchoolOs',
    expiryMinutes = 10,
}) => {
    const html = otpEmailTemplate({ otp, purpose, schoolName, expiryMinutes });
    const text = `Your ${schoolName} verification code is: ${otp}. It expires in ${expiryMinutes} minutes. Please do not share this code.`;
    const subject = `${otp} is your ${schoolName} verification code`;

    return await sendEmail({ to, subject, html, text });
};

/**
 * Send a welcome onboarding email to a newly created user.
 */
export const sendWelcomeEmail = async ({
    to,
    name,
    role,
    schoolName,
    loginUrl,
    temporaryPassword,
}) => {
    const html = welcomeEmailTemplate({ name, role, schoolName, loginUrl, temporaryPassword });
    const subject = `Welcome to ${schoolName || 'PrimeSchoolOs'}`;

    return await sendEmail({
        to,
        subject,
        html,
        text: `Welcome to ${schoolName}, ${name}! Your account has been created with role: ${role}.`,
    });
};
