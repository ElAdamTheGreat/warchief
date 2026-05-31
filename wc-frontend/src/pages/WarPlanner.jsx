// REQUIREMENT: File API, LocalStorage, Audio
import React from 'react';
import { useWar } from '../context/WarContext';
import { useDragDrop } from '../hooks/useDragDrop';
import { PlayerChip } from '../components/PlayerChip';
import { TargetSlot } from '../components/TargetSlot';
import { navigate } from '../router/Router';

export function WarPlanner() {
  const { warData, loading, error, clanTag } = useWar();
  
  // Abstraction for Drag and Drop operations and state
  const {
    assignments,
    assignTarget,
    unassignTarget,
    clearAssignments,
    getUnassignedPlayers,
    reorderAttackers
  } = useDragDrop(clanTag);

  // --- Loading State ---
  if (loading) {
    return (
      <main className="page-fade-in p-8 text-center text-slate-300">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="loading-spinner mb-6"></div>
          <p className="text-amber-500 font-body font-bold animate-pulse text-lg">
            LOADING TEAM DATA...
          </p>
        </div>
      </main>
    );
  }

  // --- Error State ---
  if (error || !warData) {
    return (
      <main className="page-fade-in p-8 text-center text-slate-300">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-headings text-red-400 mb-2">PLANNER NOT AVAILABLE</h2>
          <p className="font-body text-slate-400 max-w-md mx-auto mb-4">
            Please search for a clan with an active war in the home screen first.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-headings rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all uppercase text-sm"
          >
            Go to Search
          </button>
        </div>
      </main>
    );
  }

  const ourMembers = warData.ourMembers || [];
  const enemies = warData.enemies || [];
  const teamSize = warData.war?.teamSize || enemies.length || 0;

  // Sort lists
  const sortedMembers = [...ourMembers].sort((a, b) => b.thLevel - a.thLevel);
  const sortedEnemies = [...enemies].sort((a, b) => a.mapPosition - b.mapPosition);

  // Helper to count assignments per player
  const getPlayerAssignmentCount = (playerTag) => {
    return Object.values(assignments).filter(
      (a) => a && a.playerTag === playerTag
    ).length;
  };

  // Compute stats
  const unassignedPlayers = getUnassignedPlayers(sortedMembers);
  const assignedCount = Object.values(assignments).filter(Boolean).length;

  const fullyAssignedPlayers = sortedMembers.filter(
    (member) => getPlayerAssignmentCount(member.tag) >= 2
  );

  const handleDrop = (enemyTag, playerData) => {
    assignTarget(enemyTag, playerData);
  };

  const handleRemove = (enemyTag) => {
    unassignTarget(enemyTag);
  };

  // REQUIREMENT: File API export of assignments plan
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(assignments, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `war-plan-${clanTag.replace('#', '')}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up link and object URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export plan file", err);
    }
  };

  return (
    <main className="page-fade-in flex-grow pb-12">
      {/* Planner Top Control Bar */}
      <header className="bg-[#1a1d28]/60 border-b border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Left: Info */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H15m-3 13.5h.008v.008H12V17.25Zm0-3h.008v.008H12v-.008ZM12 11.25h.008v.008H12v-.008Zm0-3h.008v.008H12V8.25Zm0-3h.008v.008H12V5.25Zm-6 15h.008v.008H6V20.25Zm0-3h.008v.008H6v-.008Zm0-3h.008v.008H6v-.008Zm0-3h.008v.008H6v-.008Zm0-3h.008v.008H6V8.25Zm0-3h.008v.008H6V5.25Zm12 15h.008v.008H18V20.25Zm0-3h.008v.008H18v-.008Zm0-3h.008v.008H18v-.008Zm0-3h.008v.008H18v-.008Zm0-3h.008v.008H18V8.25Zm0-3h.008v.008H18V5.25ZM6 2.25h12A2.25 2.25 0 0 1 20.25 4.5v15A2.25 2.25 0 0 1 18 21.75H6A2.25 2.25 0 0 1 3.75 19.5V4.5A2.25 2.25 0 0 1 6 2.25Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-headings text-white font-extrabold tracking-wide uppercase">
                  WAR TARGET PLANNER
                </h1>
                <p className="text-[10px] text-slate-500 font-body font-semibold">
                  DRAG ATTACKERS TO TARGET SLOTS • {clanTag}
                </p>
              </div>
            </div>

            {/* Middle: Progress */}
            <div className="flex items-center gap-4 bg-[#0f1117]/60 px-5 py-2.5 rounded-xl border border-white/5 min-w-[200px]">
              <div className="flex-grow">
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 mb-1">
                  <span>ASSIGNMENT PROGRESS</span>
                  <span className="text-amber-500">{assignedCount}/{teamSize} TARGETS</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(assignedCount / teamSize) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearAssignments}
                disabled={assignedCount === 0}
                className={`px-4 py-2 text-xs font-bold font-headings rounded-lg border transition-all uppercase ${
                  assignedCount === 0
                    ? 'border-white/5 text-slate-600 cursor-not-allowed'
                    : 'border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400'
                }`}
              >
                Clear All
              </button>

              <button
                type="button"
                onClick={handleExport}
                disabled={assignedCount === 0}
                className={`px-4 py-2 text-xs font-bold font-headings rounded-lg shadow-md transition-all uppercase flex items-center gap-1.5 ${
                  assignedCount === 0
                    ? 'bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10 hover:shadow-amber-500/25'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export Plan
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Two-Panel Workspace Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel (col-span-4): Our Team members list */}
          <div className="lg:col-span-4 bg-[#1a1d28]/30 border border-white/5 rounded-2xl p-5 shadow-lg max-h-[75vh] flex flex-col">
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-headings flex items-center gap-2">
                <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
                Attacking Team
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 font-body">
                Drag active members from here to targets on the right. Each member can make up to 2 attacks.
              </p>
            </div>

            {/* Scrollable member lists */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-1.5 custom-scrollbar">
              
              {/* 1. Available Active Attackers */}
              <div>
                <span className="block text-[9px] font-bold text-amber-500/70 uppercase tracking-wider mb-2 font-body">
                  Available Attackers ({unassignedPlayers.length})
                </span>
                {unassignedPlayers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-3 bg-[#1a1d28]/40 rounded-xl border border-dashed border-white/5 text-center font-body">
                    All attackers assigned!
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {unassignedPlayers.map((member) => (
                      <PlayerChip
                        key={member.tag}
                        player={member}
                        attacksUsed={getPlayerAssignmentCount(member.tag)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Fully Assigned Attackers */}
              {fullyAssignedPlayers.length > 0 && (
                <div className="border-t border-white/5 pt-4">
                  <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-body">
                    Fully Assigned Attackers ({fullyAssignedPlayers.length})
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {fullyAssignedPlayers.map((member) => (
                      <PlayerChip
                        key={member.tag}
                        player={member}
                        attacksUsed={2}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Panel (col-span-8): Target slot grid */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-headings flex items-center gap-2">
                <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
                Enemy Targets
              </h3>
              <p className="text-[10px] text-slate-500 mt-1 font-body">
                Drop clan attackers onto target slots to plan base calls.
              </p>
            </div>

            {/* Target Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedEnemies.map((enemy) => (
                <TargetSlot
                  key={enemy.tag}
                  enemy={enemy}
                  assignment={assignments[enemy.tag] || null}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onReorder={reorderAttackers}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default WarPlanner;
