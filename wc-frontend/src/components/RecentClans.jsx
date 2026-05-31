import React from 'react';
import { useWar } from '../context/WarContext';
import { navigate } from '../router/Router';

export function RecentClans() {
  const { recentClans, setClanTag } = useWar();

  if (!recentClans || recentClans.length === 0) {
    return null;
  }

  const handleSelectClan = (tag) => {
    setClanTag(tag);
    navigate(`/war/${tag.replace('#', '')}`);
  };

  return (
    <div className="recent-clans-container max-w-xl mx-auto mt-8 text-center">
      <h3 className="font-headings font-bold text-xs uppercase tracking-widest text-slate-500 mb-3">
        RECENT BATTLEFIELDS
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {recentClans.map((clan) => (
          <button
            key={clan.tag}
            onClick={() => handleSelectClan(clan.tag)}
            className="filter-chip cursor-pointer bg-[#1a1d28] hover:bg-[#252836] border border-white/5 hover:border-amber-500/30 text-slate-400 hover:text-amber-500 font-semibold px-4 py-2 rounded-full text-xs transition-all flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>{clan.tag}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
