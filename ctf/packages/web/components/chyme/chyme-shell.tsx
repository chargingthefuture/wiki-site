import Link from 'next/link';
import { ChevronLeft, Radio } from 'lucide-react';
import { Chyme } from '@/components/mockups/survivor-hub/Chyme';

export function ChymeShell() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#021006' }}>
      {/* Left navigation rail */}
      <aside
        style={{
          width: 72,
          borderRight: '1px solid #052e16',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          gap: 16,
          background: '#030d05',
          flexShrink: 0,
        }}
      >
        {/* Back button */}
        <Link
          href="/apps"
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#22C55E',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.15)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.1)';
          }}
        >
          <ChevronLeft size={20} />
        </Link>

        {/* Chyme logo/icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22C55E',
          }}
          title="Chyme chat"
        >
          <Radio size={20} />
        </div>
      </aside>

      {/* Main Chyme component */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Chyme />
      </div>
    </div>
  );
}
