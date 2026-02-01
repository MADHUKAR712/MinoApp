/**
 * Form validation utilities
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validate phone number (supports international format)
 */
export function validatePhoneNumber(phone: string): ValidationResult {
    // Remove all non-digit characters except leading +
    const cleaned = phone.replace(/[^\d+]/g, '');

    if (!cleaned) {
        return { isValid: false, error: 'Phone number is required' };
    }

    // Check for valid format: +country code + number (10-15 digits total)
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;

    if (!phoneRegex.test(cleaned)) {
        return { isValid: false, error: 'Please enter a valid phone number' };
    }

    return { isValid: true };
}

/**
 * Validate OTP (6 digits)
 */
export function validateOTP(otp: string): ValidationResult {
    if (!otp) {
        return { isValid: false, error: 'OTP is required' };
    }

    if (!/^\d{6}$/.test(otp)) {
        return { isValid: false, error: 'OTP must be 6 digits' };
    }

    return { isValid: true };
}

/**
 * Validate display name
 */
export function validateDisplayName(name: string): ValidationResult {
    const trimmed = name.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Name is required' };
    }

    if (trimmed.length < 2) {
        return { isValid: false, error: 'Name must be at least 2 characters' };
    }

    if (trimmed.length > 50) {
        return { isValid: false, error: 'Name cannot exceed 50 characters' };
    }

    // Allow letters, spaces, hyphens, apostrophes
    if (!/^[\p{L}\s'-]+$/u.test(trimmed)) {
        return { isValid: false, error: 'Name contains invalid characters' };
    }

    return { isValid: true };
}

/**
 * Validate "about" status text
 */
export function validateAbout(about: string): ValidationResult {
    if (about.length > 150) {
        return { isValid: false, error: 'About cannot exceed 150 characters' };
    }

    return { isValid: true };
}

/**
 * Validate group name
 */
export function validateGroupName(name: string): ValidationResult {
    const trimmed = name.trim();

    if (!trimmed) {
        return { isValid: false, error: 'Group name is required' };
    }

    if (trimmed.length < 2) {
        return { isValid: false, error: 'Group name must be at least 2 characters' };
    }

    if (trimmed.length > 100) {
        return { isValid: false, error: 'Group name cannot exceed 100 characters' };
    }

    return { isValid: true };
}

/**
 * Sanitize input string (remove potential XSS/injection)
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .trim();
}
