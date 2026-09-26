/**
 * phoneHelper.js — Normalization and validation for international phone numbers.
 * Supports E.164 formatting, country prefix validation, and digit sanitation.
 */

/**
 * Normalizes an input phone number to E.164 format.
 * Defaults to India (+91) if a 10-digit number is provided without a country code.
 *
 * @param {string|number} phone - Raw input phone number
 * @param {string} [defaultCountryCode='91'] - Default country code if missing
 * @returns {string} Normalized phone number string (digits only or leading +)
 */
export const normalizePhone = (phone, defaultCountryCode = '91') => {
    if (!phone) return '';

    // Convert to string and remove all non-digit characters except leading '+'
    let cleaned = String(phone).trim().replace(/[^\d+]/g, '');

    // If starts with '+', remove the '+' for WhatsApp API which expects country code + digits
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
    }

    // If standard 10-digit number (common in India), prepend default country code
    if (cleaned.length === 10) {
        cleaned = `${defaultCountryCode}${cleaned}`;
    }

    return cleaned;
};

/**
 * Validates if the phone number has a reasonable length and valid digit structure.
 *
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    const normalized = normalizePhone(phone);
    // E.164 phone numbers typically have 10 to 15 digits
    return /^[1-9]\d{9,14}$/.test(normalized);
};

/**
 * Formats a phone number for user-friendly display (e.g. +91 98765 43210).
 *
 * @param {string} phone
 * @returns {string}
 */
export const formatPhoneDisplay = (phone) => {
    const norm = normalizePhone(phone);
    if (!norm) return '';
    if (norm.startsWith('91') && norm.length === 12) {
        return `+91 ${norm.substring(2, 7)} ${norm.substring(7)}`;
    }
    return `+${norm}`;
};
