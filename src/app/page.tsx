'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import IntroPage from '@/components/IntroPage';

// Dynamically import Terminal with SSR disabled
const TerminalComponent = dynamic(() => import('@/components/Terminal'), {
  ssr: false,
  loading: () => <div className="flex min-h-screen items-center justify-center bg-black text-green-500">Loading Terminal...</div>
});

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);

  const handleAuthenticated = () => {
    setShowTerminal(true);
  };

  const handleCloseTerminal = () => {
    setShowTerminal(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {!showTerminal ? (
        <IntroPage onAuthenticated={handleAuthenticated} />
      ) : (
        <TerminalComponent onClose={handleCloseTerminal} />
      )}
    </main>
  );
}
