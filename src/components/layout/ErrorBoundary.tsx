import { Component } from "react";

import { Button } from "@/components/ui/button";

import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Log errors in a structured format for debugging and future error tracking integration.
 */
const logError = (error: Error, errorInfo?: ErrorInfo) => {
  console.error("[App Error]", {
    message: error.message,
    name: error.name,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : "unknown",
  });
};

/**
 * Error boundary component that catches JavaScript errors in child components.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-4">
          <div className="text-center">
            <h1 className="mb-2 font-serif text-2xl text-foreground">
              Even Jonah had a whale of a problem
            </h1>
            <p className="text-muted-foreground text-sm">
              Something went awry, but fear not — we shall rise again.
            </p>
            {this.state.error && (
              <p className="mt-2 font-mono text-destructive text-xs">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={this.handleRetry}>Try Again</Button>
            <Button variant="outline" onClick={this.handleReload}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
