import React, { Suspense, lazy, useState } from 'react';

const SupabaseChat = lazy(() => import('./SupabaseChat'));

export default function ChatShell({ onClose }: { onClose: () => void }) {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="fixed bottom-20 right-6 z-50 w-80 md:w-96 max-h-[70vh] shadow-2xl rounded-lg overflow-hidden bg-card border border-border">
      <div className="flex items-center justify-between px-3 py-2 bg-background text-foreground flex-shrink-0 min-h-[44px]">
        <div className="text-sm font-semibold">Community Support</div>
        <div className="flex items-center space-x-2">
          <button
            aria-label="Minimize chat"
            onClick={() => setMinimized((v) => !v)}
            className="text-foreground/70 hover:text-foreground transition-colors text-sm"
          >
            {minimized ? 'Expand' : 'Minimize'}
          </button>
          <button aria-label="Close chat" onClick={onClose} className="text-foreground/70 hover:text-foreground transition-colors text-sm">
            Close
          </button>
        </div>
      </div>

      {!minimized && (
        <Suspense fallback={<div className="p-4 text-muted-foreground">Loading chat…</div>}>
          <SupabaseChat />
        </Suspense>
      )}
    </div>
  );
}
