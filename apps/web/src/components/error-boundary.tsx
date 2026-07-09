"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" style={{ padding: "2rem", textAlign: "center", color: "#c00" }}>
            <h2>Something went wrong</h2>
            <p>{this.state.error?.message ?? "An unexpected error occurred."}</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
