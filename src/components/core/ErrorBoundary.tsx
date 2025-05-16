'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { getErrorMessage } from '@/utils/errorMessage';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 경계 컴포넌트
 *
 * 자식 컴포넌트에서 발생한 에러를 잡아서 UI가 완전히 깨지는 것을 방지합니다.
 * 에러 발생 시 fallback UI를 표시합니다.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('컴포넌트 에러:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // 사용자 정의 fallback이 있으면 사용, 없으면 기본 에러 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4 border rounded-md bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            컴포넌트 로드 중 문제가 발생했습니다
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            {getErrorMessage(this.state.error)}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
