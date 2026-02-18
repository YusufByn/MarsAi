import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const ErrorFallback = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
    <div className="text-center max-w-md">
      <h1 className="text-4xl font-black mb-4">Something went wrong</h1>
      <p className="text-white/60 mb-6">
        An unexpected error occurred. Please refresh the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors"
      >
        Refresh page
      </button>
    </div>
  </div>
);

const onError = (error, info) => {
  console.error('[ERROR BOUNDARY]', error, info);
};

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
    {children}
  </ReactErrorBoundary>
);

export default ErrorBoundary;
