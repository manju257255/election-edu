import React from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary component to catch rendering errors and show a fallback UI.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center text-[#e8e8e8]">
          <h1 className="font-serif text-4xl">Something went wrong.</h1>
          <p className="mt-4 text-[#888]">The application encountered an unexpected error. Please refresh the page.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-md bg-[#4ade80] px-6 py-2 text-sm font-bold text-[#0a0a0a]"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
