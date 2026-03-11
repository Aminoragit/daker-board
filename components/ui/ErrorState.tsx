'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'AN ERROR OCCURRED', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertTriangle className="text-red-400" size={32} />
      <p className="font-mono text-sm text-red-400 tracking-widest">
        [ {message} ]
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 font-mono text-xs text-[--text-secondary] border border-[--border] rounded px-4 py-2 hover:border-[--accent] hover:text-[--accent] transition-all"
        >
          <RefreshCw size={12} />
          RETRY
        </button>
      )}
    </div>
  );
}
