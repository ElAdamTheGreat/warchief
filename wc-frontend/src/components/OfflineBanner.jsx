import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Show banner when we lose connection
    if (!isOnline) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-red-600 border-b border-red-500 text-white py-2.5 px-4 shadow-lg text-center flex items-center justify-center gap-3 animate-slide-down"
      style={{
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}
    >
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white animate-pulse">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <span className="text-xs font-headings font-extrabold tracking-wide uppercase">
          Network Disconnected • Displaying Cached Offline Data
        </span>
      </div>
      
      <button
        onClick={() => setShowBanner(false)}
        className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[9px] uppercase font-bold"
      >
        Dismiss
      </button>
    </div>
  );
}

export default OfflineBanner;
