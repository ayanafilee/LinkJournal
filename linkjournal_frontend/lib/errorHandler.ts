/**
 * Centralized Error Handler for LinkJournal
 * Handles all errors gracefully with user-friendly messages
 */

import toast from 'react-hot-toast';

export enum ErrorType {
    NETWORK = 'NETWORK',
    AUTHENTICATION = 'AUTHENTICATION',
    VALIDATION = 'VALIDATION',
    SERVER = 'SERVER',
    NOT_FOUND = 'NOT_FOUND',
    PERMISSION = 'PERMISSION',
    UPLOAD = 'UPLOAD',
    UNKNOWN = 'UNKNOWN',
}

export interface AppError {
    type: ErrorType;
    message: string;
    userMessage: string;
    statusCode?: number;
    originalError?: any;
}

/**
 * Maps Firebase error codes to user-friendly messages
 */
const firebaseErrorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'This email is already registered. Please login instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site.',
    'auth/popup-closed-by-user': 'Sign-in cancelled. Please try again.',
    'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    'auth/requires-recent-login': 'Please log out and log back in to perform this action.',
};

/**
 * Maps HTTP status codes to error types and messages
 */
const httpErrorMessages: Record<number, { type: ErrorType; message: string }> = {
    400: { type: ErrorType.VALIDATION, message: 'Invalid request. Please check your input.' },
    401: { type: ErrorType.AUTHENTICATION, message: 'Please log in to continue.' },
    403: { type: ErrorType.PERMISSION, message: 'You don\'t have permission to perform this action.' },
    404: { type: ErrorType.NOT_FOUND, message: 'The requested resource was not found.' },
    409: { type: ErrorType.VALIDATION, message: 'This resource already exists.' },
    500: { type: ErrorType.SERVER, message: 'Server error. Please try again later.' },
    502: { type: ErrorType.SERVER, message: 'Service temporarily unavailable. Please try again.' },
    503: { type: ErrorType.SERVER, message: 'Service is under maintenance. Please try again later.' },
};

/**
 * Parses any error and returns a structured AppError
 */
export function parseError(error: any): AppError {
    // Firebase Auth Errors
    if (error?.code && error.code.startsWith('auth/')) {
        const userMessage = firebaseErrorMessages[error.code] || 'Authentication failed. Please try again.';
        return {
            type: ErrorType.AUTHENTICATION,
            message: error.code,
            userMessage,
            originalError: error,
        };
    }

    // HTTP/API Errors (RTK Query)
    if (error?.status) {
        const statusCode = typeof error.status === 'number' ? error.status : parseInt(error.status);
        const errorInfo = httpErrorMessages[statusCode] || {
            type: ErrorType.UNKNOWN,
            message: 'An unexpected error occurred.',
        };

        return {
            type: errorInfo.type,
            message: error?.data?.message || error?.data?.error || errorInfo.message,
            userMessage: errorInfo.message,
            statusCode,
            originalError: error,
        };
    }

    // Network Errors
    if (error?.message?.toLowerCase().includes('network') || error?.message?.toLowerCase().includes('fetch')) {
        return {
            type: ErrorType.NETWORK,
            message: error.message,
            userMessage: 'Network error. Please check your internet connection.',
            originalError: error,
        };
    }

    // Validation Errors
    if (error?.name === 'ValidationError' || error?.message?.toLowerCase().includes('validation')) {
        return {
            type: ErrorType.VALIDATION,
            message: error.message,
            userMessage: error.message || 'Please check your input and try again.',
            originalError: error,
        };
    }

    // Upload Errors
    if (error?.message?.toLowerCase().includes('upload') || error?.message?.toLowerCase().includes('cloudinary')) {
        return {
            type: ErrorType.UPLOAD,
            message: error.message,
            userMessage: 'Failed to upload file. Please try again.',
            originalError: error,
        };
    }

    // Generic Error
    return {
        type: ErrorType.UNKNOWN,
        message: error?.message || 'Unknown error',
        userMessage: error?.message || 'Something went wrong. Please try again.',
        originalError: error,
    };
}

/**
 * Handles errors and displays appropriate UI feedback
 */
export function handleError(error: any, customMessage?: string): AppError {
    const appError = parseError(error);

    // Display toast notification
    const displayMessage = customMessage || appError.userMessage;

    switch (appError.type) {
        case ErrorType.AUTHENTICATION:
            toast.error(displayMessage, {
                duration: 4000,
                icon: '🔒',
            });
            break;
        case ErrorType.NETWORK:
            toast.error(displayMessage, {
                duration: 5000,
                icon: '📡',
            });
            break;
        case ErrorType.VALIDATION:
            toast.error(displayMessage, {
                duration: 3000,
                icon: '⚠️',
            });
            break;
        case ErrorType.UPLOAD:
            toast.error(displayMessage, {
                duration: 4000,
                icon: '📤',
            });
            break;
        case ErrorType.SERVER:
            toast.error(displayMessage, {
                duration: 5000,
                icon: '🔧',
            });
            break;
        default:
            toast.error(displayMessage, {
                duration: 4000,
            });
    }

    return appError;
}

/**
 * Silent error handler - logs to monitoring service without showing toast
 * Use for non-critical errors or background operations
 */
export function handleSilentError(error: any, context?: string): AppError {
    const appError = parseError(error);

    // In production, this would send to a monitoring service like Sentry
    // For now, we'll just suppress console output
    if (process.env.NODE_ENV === 'development') {
        // Only log in development, not production
        const errorLog = {
            context,
            type: appError.type,
            message: appError.message,
            timestamp: new Date().toISOString(),
        };
        // Store in sessionStorage for debugging
        try {
            const existingLogs = sessionStorage.getItem('error_logs');
            const logs = existingLogs ? JSON.parse(existingLogs) : [];
            logs.push(errorLog);
            // Keep only last 50 errors
            if (logs.length > 50) logs.shift();
            sessionStorage.setItem('error_logs', JSON.stringify(logs));
        } catch {
            // Silently fail if sessionStorage is not available
        }
    }

    return appError;
}

/**
 * Success handler for consistent success messaging
 */
export function handleSuccess(message: string, icon?: string) {
    toast.success(message, {
        duration: 3000,
        icon: icon || '✅',
    });
}

/**
 * Info handler for informational messages
 */
export function handleInfo(message: string, icon?: string) {
    toast(message, {
        duration: 3000,
        icon: icon || 'ℹ️',
    });
}

/**
 * Warning handler
 */
export function handleWarning(message: string) {
    toast(message, {
        duration: 4000,
        icon: '⚠️',
        style: {
            background: '#FEF3C7',
            color: '#92400E',
        },
    });
}
