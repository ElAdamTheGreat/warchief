import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useWarData } from '../hooks/useWarData';

const WarContext = createContext(null);

export function WarProvider({ children }) {
  const [clanTag, setClanTag] = useState(() => {
    // Attempt to grab from recent history if available
    try {
      const recents = window.localStorage.getItem('wc_recent_clans');
      if (recents) {
        const parsed = JSON.parse(recents);
        if (parsed && parsed.length > 0) return parsed[0].tag || '';
      }
    } catch (e) {}
    return '';
  });

  const { warData, loading, error } = useWarData(clanTag);

  // Persist war plans per clan tag in localStorage using our useLocalStorage hook
  // key format: wc_plan_#TAG
  const planKey = clanTag ? `wc_plan_${clanTag.replace('#', '')}` : 'wc_plan_default';
  const [plan, setPlan] = useLocalStorage(planKey, {});

  // Persist recent search tags list
  const [recentClans, setRecentClans] = useLocalStorage('wc_recent_clans', []);

  const addRecentClan = (tag, name) => {
    const formattedTag = tag.trim().toUpperCase().startsWith('#') ? tag.trim().toUpperCase() : `#${tag.trim().toUpperCase()}`;
    const newRecent = { tag: formattedTag, name: name || formattedTag, timestamp: Date.now() };
    
    setRecentClans((prev) => {
      // Remove if already exists and add to top
      const filtered = prev.filter((item) => item.tag !== formattedTag);
      return [newRecent, ...filtered].slice(0, 5); // Keep last 5
    });
  };

  const updatePlan = (targetTag, playerTag, playerDetails) => {
    setPlan((prev) => ({
      ...prev,
      [targetTag]: playerTag ? { tag: playerTag, name: playerDetails.name, thLevel: playerDetails.thLevel } : null
    }));
  };

  const clearPlan = () => {
    setPlan({});
  };

  return (
    <WarContext.Provider
      value={{
        clanTag,
        setClanTag,
        warData,
        loading,
        error,
        plan,
        setPlan,
        updatePlan,
        clearPlan,
        recentClans,
        addRecentClan
      }}
    >
      {children}
    </WarContext.Provider>
  );
}

export function useWar() {
  const context = useContext(WarContext);
  if (!context) {
    throw new Error('useWar must be used within a WarProvider');
  }
  return context;
}
