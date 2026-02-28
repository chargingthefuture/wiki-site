import React, { useState } from 'react';
import ChatShell from './ChatShell';

export default function ChatButton() {
  const [openChat, setOpenChat] = useState(false);

  return (
    <>
      <button
        aria-label="Open community support chat"
        onClick={() => setOpenChat(true)}
        className="fixed bottom-6 right-6 z-50 max-w-xs text-left bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none"
      >
        <div className="text-sm font-medium">Cannot find your Quora handle?</div>
        <div className="text-xs opacity-90">Chat live to get help.</div>
      </button>

      {openChat && <ChatShell onClose={() => setOpenChat(false)} />}
    </>
  );
}
