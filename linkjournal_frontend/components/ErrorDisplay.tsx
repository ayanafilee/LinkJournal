'use client';

import React from 'react';
import { AlertTriangle, WifiOff, ServerCrash, RefreshCw, Home, Lock } from 'lucide-react';
import Link from 'next/link';

interface ErrorDisplayProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    showHomeButton?: boolean;
    variant?: 'error' | 'network' | 'server' | 'auth' | 'notfound';
}

/**
 * Reusable Error Display Component
 * Shows user-friendly error messages with appropriate icons and actions
 */
export function ErrorDisplay({
    title,
    message,
    onRetry,
    showHomeButton = true,
    variant = 'error',
}: ErrorDisplayProps) {
    const config = {
        error: {
            icon: AlertTriangle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-100',
            iconColor: 'text-red-600',
            iconBg: 'bg-red-100',
            title: title || 'Something Went Wrong',
            message: message || 'An unexpected error occurred. Please try again.',
        },
        network: {
            icon: WifiOff,
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-100',
            iconColor: 'text-orange-600',
            iconBg: 'bg-orange-100',
            title: title || 'Connection Lost',
            message: message || 'Please check your internet connection and try again.',
        },
        server: {
            icon: ServerCrash,
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-100',
            iconColor: 'text-purple-600',
            iconBg: 'bg-purple-100',
            title: title || 'Server Error',
            message: message || 'Our servers are experiencing issues. Please try again later.',
        },
        auth: {
            icon: Lock,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-100',
            title: title || 'Authentication Required',
            message: message || 'Please log in to continue.',
        },
        notfound: {
            icon: AlertTriangle,
            bgColor: 'bg-gray-50',
            borderColor: 'border-gray-200',
            iconColor: 'text-gray-600',
            iconBg: 'bg-gray-100',
            title: title || 'Not Found',
            message: message || "The content you're looking for doesn't exist.",
        },
    };

    const currentConfig = config[variant];
    const Icon = currentConfig.icon;

    return (
        <div className={`flex items-center justify-center p-8 ${currentConfig.bgColor} rounded-2xl border ${currentConfig.borderColor}`}>
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className={`w-16 h-16 ${currentConfig.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-8 h-8 ${currentConfig.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {currentConfig.title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    {currentConfig.message}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>
                    )}
                    {showHomeButton && (
                        <Link href="/">
                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95">
                                <Home size={18} />
                                Go Home
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

/**
 * Inline Error Message Component
 * For smaller, inline error displays
 */
export function InlineError({ message }: { message: string }) {
    return (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">{message}</p>
        </div>
    );
}

/**
 * Empty State Component
 * For when there's no data to display
 */
export function EmptyState({
    title,
    message,
    actionLabel,
    actionHref,
}: {
    title: string;
    message: string;
    actionLabel?: string;
    actionHref?: string;
}) {
    return (
        <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{message}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
                        {actionLabel}
                    </button>
                </Link>
            )}
        </div>
    );
}

/**
 * Loading Error Component
 * For errors that occur during loading
 */
export function LoadingError({ onRetry }: { onRetry?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to Load</h3>
            <p className="text-gray-600 mb-6">We couldn't load this content.</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                >
                    <RefreshCw size={18} />
                    Try Again
                </button>
            )}
        </div>
    );
}
