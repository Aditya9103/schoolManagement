/**
 * whatsapp.service.js — Meta WhatsApp Cloud API integration service.
 * Supports sending template-based OTPs and notifications via Meta Graph API v21.0.
 */
import env from '../config/env.js';
import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';
import { normalizePhone, isValidPhone } from '../utils/phoneHelper.js';

const META_GRAPH_VERSION = 'v21.0';

/**
 * Sends an OTP message via Meta WhatsApp Cloud API using an approved authentication template.
 *
 * @param {Object} params
 * @param {string} params.phone - Recipient phone number (e.g. 919876543210 or +919876543210)
 * @param {string} params.otp - The 6-digit OTP
 * @returns {Promise<Object>} Meta API response data
 */
export const sendWhatsAppOtp = async ({ phone, otp }) => {
    const { phoneNumberId, accessToken, templateName, templateLang } = env.whatsapp;

    if (!phoneNumberId || !accessToken) {
        logger.warn('⚠️ Meta WhatsApp Cloud API credentials not configured in environment');
        throw ApiError.internal('WhatsApp messaging service is currently unconfigured');
    }

    const recipientPhone = normalizePhone(phone);
    if (!isValidPhone(recipientPhone)) {
        throw ApiError.badRequest(`Invalid phone number: ${phone}`);
    }

    const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${phoneNumberId}/messages`;

    // Standard Meta WhatsApp Cloud API template payload for authentication / OTP
    const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'template',
        template: {
            name: templateName || 'tcm_website_auth',
            language: {
                code: templateLang || 'en_US',
            },
            components: [
                {
                    type: 'body',
                    parameters: [
                        {
                            type: 'text',
                            text: String(otp),
                        },
                    ],
                },
                {
                    type: 'button',
                    sub_type: 'url',
                    index: '0',
                    parameters: [
                        {
                            type: 'text',
                            text: String(otp),
                        },
                    ],
                },
            ],
        },
    };

    try {
        logger.info(`📱 Sending WhatsApp OTP to +${recipientPhone} via Meta Cloud API (Template: ${payload.template.name})`);

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        let data = await response.json();

        // If template with button fails (some templates only have body parameters without buttons)
        if (!response.ok && data?.error?.message?.includes('button')) {
            logger.warn(`Template with button failed, retrying with body-only parameters for ${recipientPhone}...`);
            const fallbackPayload = {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: recipientPhone,
                type: 'template',
                template: {
                    name: templateName || 'tcm_website_auth',
                    language: { code: templateLang || 'en_US' },
                    components: [
                        {
                            type: 'body',
                            parameters: [{ type: 'text', text: String(otp) }],
                        },
                    ],
                },
            };

            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(fallbackPayload),
            });
            data = await response.json();
        }

        if (!response.ok) {
            const errCode = data?.error?.code || response.status;
            const errMsg = data?.error?.message || response.statusText;
            logger.error(`❌ Meta WhatsApp API Error [${errCode}]: ${errMsg} (Details: ${JSON.stringify(data?.error?.error_data || {})})`);
            throw ApiError.badRequest(`WhatsApp delivery failed: ${errMsg}`);
        }

        const messageId = data?.messages?.[0]?.id;
        logger.info(`✅ WhatsApp OTP sent successfully to +${recipientPhone} (MessageID: ${messageId})`);

        return {
            success: true,
            messageId,
            recipientPhone,
        };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        logger.error(`❌ WhatsApp dispatch exception for ${recipientPhone}: ${error.message}`);
        throw ApiError.internal(`Failed to deliver WhatsApp message: ${error.message}`);
    }
};

/**
 * Sends a regular text message via WhatsApp (requires active customer service window).
 *
 * @param {Object} params
 * @param {string} params.phone - Recipient phone number
 * @param {string} params.text - Message content
 * @returns {Promise<Object>}
 */
export const sendWhatsAppNotification = async ({ phone, text }) => {
    const { phoneNumberId, accessToken } = env.whatsapp;

    if (!phoneNumberId || !accessToken) {
        throw ApiError.internal('WhatsApp messaging service is currently unconfigured');
    }

    const recipientPhone = normalizePhone(phone);
    const url = `https://graph.facebook.com/${META_GRAPH_VERSION}/${phoneNumberId}/messages`;

    const payload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhone,
        type: 'text',
        text: {
            preview_url: false,
            body: text,
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw ApiError.badRequest(`WhatsApp notification failed: ${data?.error?.message || response.statusText}`);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw ApiError.internal(`Failed to send WhatsApp notification: ${error.message}`);
    }
};
