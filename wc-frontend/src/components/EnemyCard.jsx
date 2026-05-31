// REQUIREMENT: Semantic tags (1pt) – <article>
import React from 'react';
import { navigate } from '../router/Router';
import { ArmyPreview } from './ArmyPreview';
import { StarRating } from './StarRating';

export function EnemyCard({ enemy, clanTag, index = 0, isSelected = false, onSelect, assignment = null }) {
  // Get TH image
  const thLevel = enemy.thLevel || 1;
  const thImgSrc = `/town-halls/${thLevel}_small.webp`;

  // Staggered delay for slide-in animation
  const staggerClass = `stagger-delay-${(index % 10) + 1}`;

  // Calculate best defense (min stars or best ratings)
  const defenses = enemy.defenses || [];
  let bestDefenseStars = 0;
  let hasDefended = false;

  if (defenses.length > 0) {
    hasDefended = true;
    bestDefenseStars = Math.max(...defenses.map(d => d.stars || 0));
  }

  // Parse assignment status
  const hasNotes = assignment && assignment.notes && assignment.notes.trim().length > 0;
  const attackers = assignment && assignment.attackers ? assignment.attackers : [];

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <article
      onClick={handleClick}
      className={`enemy-card-item slide-in-card ${staggerClass} relative flex items-center justify-between p-4 mb-3 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-4px] cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-amber-500 bg-[#252836] shadow-[0_0_15px_rgba(244,164,35,0.25)] scale-[1.01]'
          : 'border-white/5 bg-[#1a1d28]/75 backdrop-blur-md hover:border-amber-500/30'
      }`}
      style={{
        boxShadow: isSelected ? '0 0 15px rgba(244,164,35,0.15)' : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
      }}
    >
      <div className="flex items-center gap-4">
        {/* Map Position Badge */}
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#252836] border border-white/10 font-headings font-bold text-sm text-amber-500 shadow-inner">
          <span className="rank-badge-overlay">{enemy.mapPosition}</span>
        </div>

        {/* TH Image (Enlarged) */}
        <div className="relative flex-shrink-0 w-16 h-16 flex items-center justify-center bg-[#0f1117] rounded-lg border border-white/5 overflow-hidden p-1 shadow-inner">
          <img
            src={thImgSrc}
            alt={`Town Hall ${thLevel}`}
            className="w-14 h-14 object-contain transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = '/town-halls/1_small.webp';
            }}
          />
          <span className="absolute bottom-0 right-0 px-1 bg-[#252836] text-[8px] font-bold rounded text-amber-500 border border-white/5">
             TH{thLevel}
          </span>
        </div>

        {/* Name and Stars */}
        <div className="flex flex-col">
          <h3 className="font-headings font-bold text-slate-200 hover:text-amber-400 transition-colors duration-200 text-base">
            {enemy.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-slate-500 font-semibold font-body uppercase">BEST DEFENSE:</span>
            {hasDefended ? (
              <StarRating rating={bestDefenseStars} size={12} />
            ) : (
              <span className="text-[10px] text-slate-600 font-semibold font-body italic">NO ATTACKS</span>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Badges Panel */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
        {/* Notes Indicator */}
        {hasNotes && (
          <div 
            className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-1 rounded-lg shadow-sm text-[10px] font-headings font-bold uppercase tracking-wider animate-pulse"
            title="Tactical plan notes added to this base"
          >
            💬 Notes
          </div>
        )}
        
        {/* Attacker Assigned Badges */}
        {attackers.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 justify-end">
            <div 
              key={attackers[0].tag}
              className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-headings font-bold shadow-md animate-fade-in"
              title={`Primary attacker: ${attackers[0].name}`}
            >
              <span className="text-[9px]">⚔️</span>
              {attackers[0].name}
            </div>
            {attackers.length > 1 && (
              <span className="text-[9px] text-slate-400 font-body italic uppercase tracking-wider ml-1 mt-0.5" title="Secondary attacker assigned">
                +1 Backup
              </span>
            )}
          </div>
        ) : (
          <span className="text-[10px] text-slate-600 font-body italic uppercase tracking-wider hidden sm:inline mr-1">
             Unassigned
          </span>
        )}
      </div>
    </article>
  );
}

export default EnemyCard;
