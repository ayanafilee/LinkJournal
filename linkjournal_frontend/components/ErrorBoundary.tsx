'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to monitoring service in production
        this.setState({ error, errorInfo });

        // In development, store error details
        if (process.env.NODE_ENV === 'development') {
            try {
                const errorLog = {
                    message: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                    timestamp: new Date().toISOString(),
                };
                sessionStorage.setItem('last_error_boundary', JSON.stringify(errorLog));
            } catch {
                // Silently fail
            }
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                        <div className="flex flex-col items-center text-center">
                            {/* Error Icon */}
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="w-10 h-10 text-red-600" />
                            </div>

                            {/* Error Title */}
                            <h1 className="text-3xl font-black text-gray-900 mb-3">
                                Oops! Something went wrong
                            </h1>

                            {/* Error Message */}
                            <p className="text-gray-600 text-lg mb-8 max-w-md">
                                We encountered an unexpected error. Don't worry, your data is safe.
                                Please try refreshing the page or return home.
                            </p>

                            {/* Development Error Details */}
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="w-full mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 text-left">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Development Error Details
                                    </p>
                                    <p className="text-sm text-red-600 font-mono break-all">
                                        {this.state.error.message}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <button
                                    onClick={this.handleReset}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
                                >
                                    <RefreshCw size={20} />
                                    Try Again
                                </button>
                                <Link href="/">
                                    <button className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95 w-full sm:w-auto">
                                        <Home size={20} />
                                        Go Home
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Async Error Boundary for handling async errors
 * Use this wrapper for components that make async calls
 */
export function AsyncErrorBoundary({ children }: { children: ReactNode }) {
    return (
        <ErrorBoundary
            fallback={
                <div className="min-h-[400px] flex items-center justify-center">
                    <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-md">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-red-900 mb-2">
                            Failed to Load Content
                        </h3>
                        <p className="text-red-600 text-sm">
                            We couldn't load this section. Please refresh the page.
                        </p>
                    </div>
                </div>
            }
        >
            {children}
        </ErrorBoundary>
    );
}
