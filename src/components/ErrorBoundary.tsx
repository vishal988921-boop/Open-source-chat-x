import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0d0d0d]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full glass-panel rounded-3xl p-8 text-center space-y-6 border-red-500/20"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mx-auto border border-red-500/20">
              <AlertCircle size={32} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                An unexpected error occurred. We've been notified and are looking into it.
              </p>
            </div>

            <div className="bg-black/20 rounded-xl p-4 text-left overflow-x-auto">
              <pre className="text-[10px] font-mono text-red-400/80 whitespace-pre-wrap">
                {this.state.error?.message || 'Unknown error'}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-2xl hover:bg-gray-100 transition-all shadow-xl"
            >
              <RefreshCw size={18} />
              <span>Reload Application</span>
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
