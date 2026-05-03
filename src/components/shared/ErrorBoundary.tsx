import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 p-6 text-center">
          <span className="text-5xl">😢</span>
          <p className="font-fredoka text-lg text-white">앗, 문제가 생겼어요!</p>
          <p className="text-sm text-white/50 max-w-sm break-keep">
            화면을 다시 불러올게요. 계속 발생하면 새로고침해주세요.
          </p>
          <button
            onClick={this.handleReset}
            className="px-5 py-2 rounded-full bg-gold text-navy font-bold text-sm"
          >
            🔄 다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
