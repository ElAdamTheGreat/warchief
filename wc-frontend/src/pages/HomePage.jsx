import React from 'react';
import { ClanSearchForm } from '../components/ClanSearchForm';
import { RecentClans } from '../components/RecentClans';
import { useWar } from '../context/WarContext';
import { navigate } from '../router/Router';

/**
 * War status badge label
 */
function warStateLabel(state) {
  switch (state) {
    case 'preparation': return 'Preparation Day';
    case 'inWar': return 'Battle Day';
    case 'warEnded': return 'War Ended';
    default: return state || 'Unknown';
  }
}

function warStateBadgeColor(state) {
  switch (state) {
    case 'preparation': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'inWar': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'warEnded': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }
}

/**
 * Determine Win/Loss/Draw status
 */
function getResultStatus(clan, opponent) {
  const ourStars = clan.stars || 0;
  const theirStars = opponent?.stars || 0;
  const ourDest = clan.destructionPercentage || 0;
  const theirDest = opponent?.destructionPercentage || 0;

  if (ourStars > theirStars) {
    return { text: 'Victory', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  } else if (ourStars < theirStars) {
    return { text: 'Defeat', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  } else {
    if (ourDest > theirDest) {
      return { text: 'Victory', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    } else if (ourDest < theirDest) {
      return { text: 'Defeat', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
    return { text: 'Draw', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' };
  }
}

/**
 * Live War Preview Card — shows current war status for the active clan
 */
function WarPreviewCard({ warData, clanTag, loading, error }) {
  const urlTag = clanTag ? clanTag.replace('#', '') : '';

  if (loading) {
    return (
      <div className="war-preview-card bg-[#1a1d28] border border-white/5 rounded-2xl p-6 max-w-2xl mx-auto mb-8 animate-pulse">
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="loading-spinner border-t-amber-500" />
          <span className="text-slate-400 font-body text-sm">Loading active war data...</span>
        </div>
      </div>
    );
  }

  if (error || !warData) {
    return null; // Don't show card if no war data available
  }

  const { war, clan, opponent, enemies } = warData;
  const isEnded = war.state === 'warEnded';
  const result = isEnded ? getResultStatus(clan, opponent) : null;

  return (
    <div
      className="war-preview-card relative overflow-hidden bg-[#1a1d28] border border-amber-500/15 rounded-2xl max-w-2xl mx-auto mb-8 cursor-pointer group transition-all duration-300 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5"
      onClick={() => navigate(`/war/${urlTag}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/war/${urlTag}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-red-500/5 pointer-events-none" />

      {/* War state banner */}
      <div className="relative flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#0f1117]/35">
        <div className="flex items-center gap-3">
          <img src="/ui/swords.webp" alt="" className="w-5 h-5 opacity-70" />
          <span className="font-headings font-bold text-xs text-slate-300 uppercase tracking-wider">
            Active War Preview
          </span>
        </div>
        <div className="flex gap-2">
          {isEnded && result && (
            <span className={`text-[10px] font-headings font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${result.color}`}>
              {result.text}
            </span>
          )}
          <span className={`text-[10px] font-headings font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${warStateBadgeColor(war.state)}`}>
            {warStateLabel(war.state)}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative p-6 space-y-4">
        {/* Score comparison display */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Our Clan */}
          <div className="flex-1 text-left min-w-0">
            <div className="font-headings font-black text-lg text-white mb-0.5 truncate group-hover:text-amber-400 transition-colors">
              {clan.name}
            </div>
            <p className="text-[10px] text-slate-500 font-body uppercase tracking-wider">Our Clan</p>
            <p className="text-xs text-slate-400 font-body mt-1">
              <span className="text-amber-500 font-bold">{clan.stars}</span> Stars • <span className="font-semibold">{Math.round(clan.destructionPercentage)}%</span>
            </p>
          </div>

          {/* Center vs score indicator */}
          <div className="flex flex-col items-center px-4 py-1.5 bg-[#0f1117]/60 rounded-xl border border-white/5 flex-shrink-0">
            <span className="text-xs font-headings font-black text-slate-500 tracking-widest italic">VS</span>
            <span className="font-headings font-black text-xl text-amber-500 tracking-tight mt-0.5">
              {clan.stars} - {opponent?.stars || 0}
            </span>
          </div>

          {/* Right: Opponent Clan */}
          <div className="flex-1 text-right min-w-0">
            <div className="font-headings font-black text-lg text-white mb-0.5 truncate">
              {opponent?.name || 'Opponent'}
            </div>
            <p className="text-[10px] text-slate-500 font-body uppercase tracking-wider">Enemy Clan</p>
            <p className="text-xs text-slate-400 font-body mt-1">
              <span className="text-amber-500 font-bold">{opponent?.stars || 0}</span> Stars • <span className="font-semibold">{Math.round(opponent?.destructionPercentage || 0)}%</span>
            </p>
          </div>

        </div>

        {/* CTA arrow */}
        <div className="absolute bottom-6 right-6 text-slate-600 group-hover:text-amber-500 transition-colors">
          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { warData, loading, error, clanTag, setClanTag, addRecentClan } = useWar();

  const handleSelectFeaturedClan = (tag) => {
    setClanTag(tag);
    addRecentClan(tag, 'The Rushers');
    navigate(`/war/${tag.replace('#', '')}`);
  };

  return (
    <main className="page-fade-in flex flex-col items-center min-h-[80vh] px-4 py-10 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Hero header */}
      <div className="text-center mb-8 relative z-10 max-w-2xl">
        <div className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-500 font-headings font-extrabold text-[10px] tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-4">
          Clash of Clans War Coordinator
        </div>
        <h1 className="font-headings font-black text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-3 tracking-tight">
          CLASH OF CLANS{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
            WAR PLANNER
          </span>
        </h1>
        <p className="font-body text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
          Input your Clan Tag to retrieve live war data, analyze opponent armies, and coordinate attack targets.
        </p>
      </div>

      {/* Featured Demo Spotlight Card */}
      <div className="w-full max-w-xl mx-auto mb-8 bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 p-5 rounded-2xl shadow-xl flex items-center justify-between z-10 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-red-500/5 pointer-events-none" />
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#1a1d28]/95 rounded-xl border border-amber-500/30 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <img src="/ui/swords.webp" alt="War" className="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="min-w-0">
            <h2 className="font-headings font-black text-slate-200 text-sm tracking-wide group-hover:text-amber-400 transition-colors uppercase leading-tight">
              Featured: The Rushers
            </h2>
            <p className="text-[9px] text-amber-500 font-bold uppercase tracking-wider mt-0.5">
              TAG: #2GJPRRV8P
            </p>
            <p className="text-[11px] text-slate-400 font-body mt-1 leading-relaxed">
              Grade project instantly! Auto-loops war phases every 2 days.
            </p>
          </div>
        </div>
        <button
          onClick={() => handleSelectFeaturedClan('#2GJPRRV8P')}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-[#0f1117] font-headings font-black text-[11px] rounded-lg tracking-wider uppercase shadow-md shadow-amber-500/10 cursor-pointer transition-all hover:scale-105"
        >
          Launch Demo
        </button>
      </div>

      {/* Live War Preview */}
      {clanTag && (
        <section className="w-full relative z-10">
          <WarPreviewCard warData={warData} clanTag={clanTag} loading={loading} error={error} />
        </section>
      )}

      {/* Search form */}
      <section className="w-full relative z-10">
        <ClanSearchForm />
      </section>

      {/* Recent clans */}
      <section className="w-full relative z-10">
        <RecentClans />
      </section>
    </main>
  );
}
