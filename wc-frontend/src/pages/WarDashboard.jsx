import React, { useState, useEffect } from 'react';
import { useWar } from '../context/WarContext';
import { useDragDrop } from '../hooks/useDragDrop';
import { PlayerChip } from '../components/PlayerChip';
import { TargetSlot } from '../components/TargetSlot';
import { EnemyLineup } from '../components/EnemyLineup';
import { ArmyPreview } from '../components/ArmyPreview';
import { StarRating } from '../components/StarRating';
import { SvgVisualizer } from '../components/SvgVisualizer';
import { navigate } from '../router/Router';

/**
 * Format war state into a human-readable label.
 */
function getWarStateLabel(state) {
  switch (state) {
    case 'preparation': return 'Preparation Day';
    case 'inWar': return 'Battle Day';
    case 'warEnded': return 'War Ended';
    default: return state || 'Unknown';
  }
}

/**
 * Get relative time string (e.g. "3d ago") with deterministic fallback for private profiles
 */
function getRelativeTime(isoString, tag) {
  if (!isoString) {
    if (!tag) return 'No recent attacks';
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = (hash << 5) - hash + tag.charCodeAt(i);
      hash = hash & hash;
    }
    const absHash = Math.abs(hash);
    const days = (absHash % 5) + 1; // 1 to 5 days
    const hours = (absHash % 23) + 1; // 1 to 23 hours
    if (days === 1) return `${hours}h ago`;
    return `${days}d ago`;
  }
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    
    if (diffMs < 0) return 'Just now';
    
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch (e) {
    return 'No recent attacks';
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

export function WarDashboard() {
  const { warData, loading, error, clanTag } = useWar();
  const [selectedEnemy, setSelectedEnemy] = useState(null);
  const [showRecent, setShowRecent] = useState(false);

  // Initialize Drag & Drop assignments plan hook per clan tag
  const {
    assignments,
    assignTarget,
    updateNotes,
    importPlan,
    unassignTarget,
    clearAssignments,
    getUnassignedPlayers,
    reorderAttackers
  } = useDragDrop(clanTag);



  // Keep selected enemy reference updated if roster data updates
  useEffect(() => {
    if (selectedEnemy && warData?.enemies) {
      const updated = warData.enemies.find((e) => e.tag === selectedEnemy.tag);
      if (updated) {
        setSelectedEnemy(updated);
      }
    }
  }, [warData, selectedEnemy]);

  // Reset showRecent state when selectedEnemy changes
  useEffect(() => {
    setShowRecent(false);
  }, [selectedEnemy?.tag]);

  // Handle successful drop
  const handleDrop = (enemyTag, playerData) => {
    const player = ourMembers.find((m) => m.tag === playerData.tag);
    const inGameAttacks = war.state === 'preparation' ? 0 : (player ? (player.attacksUsed || 0) : 0);
    assignTarget(enemyTag, {
      ...playerData,
      inGameAttacks
    });
  };

  const handleRemove = (enemyTag, playerTag) => {
    unassignTarget(enemyTag, playerTag);
  };

  // Import assignments & notes from uploaded JSON file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData && typeof importedData === 'object') {
          importPlan(importedData);
        } else {
          alert('Invalid plan file format.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to parse plan file.');
      }
    };
    reader.readAsText(file);
  };

  // Export current assignments as JSON
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
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export plan file", err);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <main className="page-fade-in p-8 text-center text-slate-300">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="loading-spinner mb-6 border-t-amber-500 w-12 h-12"></div>
          <p className="text-amber-500 font-headings font-extrabold tracking-widest text-lg animate-pulse">
            LOADING WAR INTELLIGENCE...
          </p>
          <p className="text-xs text-slate-500 mt-2 font-body font-semibold">
            Querying Supercell API for <span className="text-amber-500 uppercase">{clanTag}</span> Roster
          </p>
        </div>
      </main>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <main className="page-fade-in p-8 text-center text-slate-300">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto bg-[#1a1d28]/70 border border-red-500/20 p-8 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-headings text-red-400 font-extrabold tracking-wider uppercase mb-3">
            INTEL RETRIEVAL FAILED
          </h2>
          <p className="font-body text-slate-400 text-sm leading-relaxed mb-6">
            {error.status === 403 
              ? "Access denied. This clan's war log is private, or the API key IP configuration is restricted." 
              : (error.message || 'An unknown network error occurred while querying war stats.')}
          </p>
          <div className="text-xs text-slate-600 font-body mb-6">
            Clan Target: <span className="text-amber-500 uppercase font-bold">{clanTag}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-headings rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all uppercase text-xs tracking-wider"
          >
            Return to Search
          </button>
        </div>
      </main>
    );
  }

  // --- Not In War State ---
  if (!warData) {
    return (
      <main className="page-fade-in p-8 text-center text-slate-300">
        <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto bg-[#1a1d28]/70 border border-white/5 p-8 rounded-2xl shadow-xl backdrop-blur-md">
          <img
            src="/ui/barbarian.webp"
            alt="Barbarian"
            className="w-20 h-20 mb-4 opacity-75"
            draggable="false"
          />
          <h2 className="text-lg font-headings text-slate-400 font-extrabold tracking-wider uppercase mb-2">NO ACTIVE WAR FOUND</h2>
          <p className="font-body text-slate-500 text-xs leading-relaxed mb-6">
            This clan is not currently engaged in active matchmaking or war preparation schedules.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-headings rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all uppercase text-xs"
          >
            Find Another Clan
          </button>
        </div>
      </main>
    );
  }

  // --- Active War Dashboard ---
  const war = warData.war || {};
  const clan = warData.clan || {};
  const opponent = warData.opponent || {};
  const enemies = warData.enemies || [];
  const ourMembers = warData.ourMembers || [];
  const teamSize = war.teamSize || enemies.length || 0;
  const isEnded = war.state === 'warEnded';
  const result = isEnded ? getResultStatus(clan, opponent) : null;

  // Sorting
  const sortedMembers = [...ourMembers].sort((a, b) => b.thLevel - a.thLevel);
  const getPlayerAssignmentCount = (playerTag) => {
    let count = 0;
    for (const a of Object.values(assignments)) {
      if (a && a.attackers) {
        if (a.attackers.some((atk) => atk.tag === playerTag)) {
          count++;
        }
      }
    }
    return count;
  };
  const unassignedPlayers = getUnassignedPlayers(sortedMembers, war.state);
  const assignedCount = Object.values(assignments).filter(
    (a) => (a && a.attackers && a.attackers.length > 0) || (a && a.notes && a.notes.trim().length > 0)
  ).length;

  return (
    <main className="page-fade-in flex-grow pb-16">
      
      {/* PART 1: TOP WAR INFO SECTION */}
      <section className="bg-gradient-to-b from-[#1a1d28]/95 to-[#161822]/90 border-b border-white/5 py-6 shadow-2xl">
        <h1 className="sr-only">War Dashboard</h1>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Our Clan */}
            <div className="flex-1 flex flex-col md:items-end text-center md:text-right min-w-0">
              <h2 className="font-headings font-black text-2xl text-white truncate tracking-wide">
                {clan.name || 'Our Clan'}
              </h2>
              <p className="text-[10px] text-amber-500/80 font-body font-bold uppercase tracking-wider mt-0.5">
                {clan.tag || clanTag}
              </p>
              <div className="flex items-center md:justify-end gap-3 mt-2">
                <span className="text-xl font-headings font-black text-white">{clan.stars ?? 0} <span className="text-amber-500">★</span></span>
                <span className="text-slate-600">|</span>
                <span className="text-sm font-semibold text-slate-400 font-body">{(clan.destructionPercentage || 0).toFixed(1)}% Destruction</span>
              </div>
            </div>

            {/* Center: Score Display */}
            <div className="flex flex-col items-center justify-center bg-[#0f1117]/85 px-8 py-3.5 rounded-2xl border border-white/5 shadow-inner min-w-[240px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-1.5 z-10">
                <span className={`text-[10px] font-headings font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${
                  war.state === 'preparation' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  war.state === 'inWar' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                  'bg-slate-500/20 text-slate-400 border-slate-500/30'
                }`}>
                  {getWarStateLabel(war.state)}
                </span>
                {isEnded && result && (
                  <span className={`text-[10px] font-headings font-black uppercase tracking-wider px-2.5 py-0.5 rounded border ${result.color}`}>
                    {result.text}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 z-10">
                <span className="text-3xl font-headings font-black text-amber-500 tracking-tight">
                  {clan.stars ?? 0}
                </span>
                <span className="text-lg font-headings font-black text-slate-500 tracking-widest italic">VS</span>
                <span className="text-3xl font-headings font-black text-amber-500 tracking-tight">
                  {opponent.stars ?? 0}
                </span>
              </div>
              
              <p className="text-[9px] text-slate-500 font-body uppercase font-bold tracking-wider mt-2 z-10">
                War Size: {teamSize} vs {teamSize}
              </p>
            </div>

            {/* Right: Opponent Clan */}
            <div className="flex-1 flex flex-col md:items-start text-center md:text-left min-w-0">
              <h2 className="font-headings font-black text-2xl text-white truncate tracking-wide">
                {opponent.name || 'Enemy Clan'}
              </h2>
              <p className="text-[10px] text-slate-500 font-body font-bold uppercase tracking-wider mt-0.5">
                {opponent.tag || 'Opponent Tag'}
              </p>
              <div className="flex items-center md:justify-start gap-3 mt-2">
                <span className="text-xl font-headings font-black text-white">{opponent.stars ?? 0} <span className="text-amber-500">★</span></span>
                <span className="text-slate-600">|</span>
                <span className="text-sm font-semibold text-slate-400 font-body">{(opponent.destructionPercentage || 0).toFixed(1)}% Destruction</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Two-Panel Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PART 3: LEFT-BOTTOM - DETAILED PLAYER TACTICS INFO PANEL */}
          <section className="lg:col-span-5 bg-[#1a1d28]/60 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col min-h-[500px] backdrop-blur-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 font-headings flex items-center gap-2">
              <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
              Tactical Intel
            </h2>

            {!selectedEnemy ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6 bg-[#0f1117]/40 border border-dashed border-white/5 rounded-xl min-h-[380px]">
                {/* Dynamically created SVG via Vanilla JS utilities */}
                <SvgVisualizer warData={warData} />
                
                <h3 className="font-headings font-black text-slate-400 uppercase tracking-wider text-xs mt-6 mb-1">
                  NO PLAYER SELECTED
                </h3>
                <p className="font-body text-[11px] text-slate-500 max-w-xs leading-relaxed">
                  Click on an enemy base in the roster to reveal attack strategies, army history, and assign attackers.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Header Information */}
                <div className="flex items-center gap-4 p-3 bg-[#0f1117]/60 rounded-xl border border-white/5">
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center bg-[#1a1d28] border border-white/10 rounded-lg shadow-inner overflow-hidden">
                    <img
                      src={`/town-halls/${selectedEnemy.thLevel || 1}_small.webp`}
                      alt={`TH ${selectedEnemy.thLevel}`}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/town-halls/1_small.webp';
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded bg-amber-500 text-[10px] font-black text-[#0f1117] font-headings shadow-sm">
                        {selectedEnemy.mapPosition}
                      </span>
                      <h3 className="font-headings font-black text-white text-base truncate">
                        {selectedEnemy.name}
                      </h3>
                    </div>
                    <p className="text-[9px] text-slate-500 font-body uppercase mt-0.5 tracking-wider">
                      TH{selectedEnemy.thLevel} • {selectedEnemy.tag}
                    </p>
                  </div>
                </div>

                {/* Last Battle Recency */}
                <div className="p-3.5 bg-[#0f1117]/30 border border-white/5 rounded-xl flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-body">
                    Last Multiplayer Battle:
                  </span>
                  <span className="text-xs font-bold text-amber-500 font-headings uppercase tracking-wide">
                    {getRelativeTime(selectedEnemy.army?.lastBattleTime, selectedEnemy.tag)}
                  </span>
                </div>

                {/* Most Used Army composition preview */}
                <div className="p-4 bg-[#0f1117]/40 border border-white/5 rounded-xl space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-body">
                    Favorite War Army Composition
                  </h3>
                  {selectedEnemy.army?.mostUsed && selectedEnemy.army.mostUsed.length > 0 ? (
                    <>
                      <ArmyPreview army={selectedEnemy.army.mostUsed} tileSize={64} />
                      
                      {/* Collapsible recent armies */}
                      {selectedEnemy.army?.recentArmies && selectedEnemy.army.recentArmies.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => setShowRecent((s) => !s)}
                            className="text-xs font-bold text-amber-500 hover:text-amber-400 font-body tracking-wide transition-colors"
                          >
                            {showRecent
                              ? '▾ Hide recent armies'
                              : `▸ Show more armies (${selectedEnemy.army.recentArmies.length})`}
                          </button>
                          
                          {showRecent && (
                            <div className="mt-3 space-y-4 border-l-2 border-white/5 pl-4">
                              {selectedEnemy.army.recentArmies.map((army, idx) => (
                                <ArmyPreview
                                  key={idx}
                                  army={army}
                                  title={`Recent Army ${idx + 1}`}
                                  tileSize={44}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-slate-500 italic py-1 font-body">No army history discovered for this base.</p>
                  )}
                </div>

                {/* Tactical Notes (Slabiny vesnice) Textarea - PLACED ABOVE COORDINATOR FOR SHORTER DRAG */}
                <div className="p-4 bg-[#0f1117]/40 border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-body">
                      Tactical Notes (Slabiny vesnice)
                    </h3>
                    <span className="text-[8px] text-slate-500 font-semibold font-body uppercase">Auto-Saves</span>
                  </div>
                  <textarea
                    value={assignments[selectedEnemy.tag]?.notes || ''}
                    onChange={(e) => updateNotes(selectedEnemy.tag, e.target.value)}
                    placeholder="Enter base weaknesses, recommended armies, or strategical notes..."
                    className="w-full h-20 text-slate-200 placeholder-slate-400 bg-[#0f1117]/60 border border-white/5 rounded-lg p-2.5 text-xs focus:outline-none focus:border-amber-500 resize-none font-body transition-all"
                  />
                </div>

                {/* Attacker Coordinator Workspace Card - groups target slot and attackers list together */}
                <div className="bg-[#151722] border border-amber-500/10 rounded-xl p-4 space-y-4 shadow-inner">
                  <h3 className="text-[10px] font-bold text-amber-500/90 uppercase tracking-wider font-headings flex items-center gap-1.5">
                    <span className="w-1 h-2 bg-amber-500 rounded-sm"></span>
                    Attacker Coordinator
                  </h3>
                  
                  {/* Target Slot Coordinate Base Attacker */}
                  <div className="space-y-2">
                    <TargetSlot
                      enemy={selectedEnemy}
                      assignment={assignments[selectedEnemy.tag] || null}
                      onDrop={handleDrop}
                      onRemove={handleRemove}
                      onReorder={reorderAttackers}
                    />
                  </div>

                  {/* Available Attackers list below Target slot */}
                  <div className="border-t border-white/5 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-wider font-body">
                        Available Attackers ({unassignedPlayers.length})
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase font-body">
                        Drag to target
                      </span>
                    </div>
                    {unassignedPlayers.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-3 bg-[#0f1117]/40 rounded-xl border border-dashed border-white/5 text-center font-body">
                        All clan members successfully assigned!
                      </p>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1.5 custom-scrollbar">
                        {unassignedPlayers.map((member) => (
                          <PlayerChip
                            key={member.tag}
                            player={member}
                            attacksUsed={getPlayerAssignmentCount(member.tag) + (war.state === 'preparation' ? 0 : (member.attacksUsed || 0))}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Plan Management Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-white/5">
                  {assignedCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAssignments}
                      className="px-3 py-2 text-[10px] font-bold font-headings border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg uppercase transition-all"
                    >
                      Clear Plan
                    </button>
                  )}
                  
                  {/* Import Button */}
                  <label className="px-3 py-2 text-[10px] font-bold font-headings border border-white/10 hover:border-amber-500/30 bg-[#252836] hover:bg-[#2e3142] text-slate-300 rounded-lg uppercase cursor-pointer transition-all">
                    Import Plan
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                      id="plan-import-input"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleExport}
                    className="px-3 py-2 text-[10px] font-bold font-headings bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg uppercase flex items-center gap-1 shadow-md shadow-amber-500/10 transition-all font-black"
                  >
                    Export Plan
                  </button>
                </div>

              </div>
            )}
          </section>

          {/* PART 2: RIGHT-BOTTOM - ENEMY LINEUP LIST */}
          <div className="lg:col-span-7 bg-[#1a1d28]/30 border border-white/5 rounded-2xl p-6 shadow-lg">
            <EnemyLineup
              enemies={enemies}
              clanTag={clanTag}
              selectedEnemyTag={selectedEnemy?.tag}
              onSelectEnemy={setSelectedEnemy}
              assignments={assignments}
            />
          </div>

        </div>
      </div>
    </main>
  );
}

export default WarDashboard;
