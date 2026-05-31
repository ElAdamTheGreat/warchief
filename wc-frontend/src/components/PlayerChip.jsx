// REQUIREMENT: Advanced JS APIs (3pt) – draggable, ondragstart
import React, { useState } from 'react';

export function PlayerChip({ player, attacksUsed = 0 }) {
  const [isDragging, setIsDragging] = useState(false);

  const isFullyAssigned = attacksUsed >= 2;

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    // Set player data in dataTransfer
    e.dataTransfer.setData('application/json', JSON.stringify({
      tag: player.tag,
      name: player.name,
      thLevel: player.thLevel
    }));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const thImgSrc = `/town-halls/${player.thLevel || 1}_small.webp`;

  return (
    <div
      draggable={!isFullyAssigned}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`draggable-chip flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border select-none transition-all duration-300 ${
        isFullyAssigned
          ? 'bg-[#1a1d28]/30 border-white/5 opacity-40 cursor-not-allowed'
          : isDragging
            ? 'bg-[#252836] border-amber-500 scale-95 opacity-40 shadow-inner'
            : 'bg-[#252836] border-white/5 text-slate-200 cursor-grab hover:border-amber-500/30 hover:scale-[1.02] hover:bg-[#2e3142]'
      }`}
      style={{
        touchAction: 'none' // Prevent default touch actions during drag
      }}
    >
      {/* TH Icon inside chip */}
      <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-[#0f1117]/60 rounded-md border border-white/5">
        <img
          src={thImgSrc}
          alt={`TH ${player.thLevel}`}
          className="w-5 h-5 object-contain"
          onError={(e) => {
            e.currentTarget.src = '/town-halls/1_small.webp';
          }}
        />
      </div>

      <div className="flex flex-col min-w-0 mr-auto">
        <span className="font-headings font-bold text-xs truncate leading-tight">
          {player.name}
        </span>
        <span className="text-[8px] text-slate-500 font-semibold font-body leading-none mt-0.5 uppercase">
          TH{player.thLevel}
        </span>
      </div>

      {/* Sleek two-dot indicator for war attacks */}
      <div className="flex gap-1 ml-1.5 flex-shrink-0">
        <span 
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            attacksUsed < 1 
              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse' 
              : 'bg-slate-600'
          }`} 
          title={attacksUsed < 1 ? "Attack 1 available" : "Attack 1 used"}
        />
        <span 
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            attacksUsed < 2 
              ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)] animate-pulse' 
              : 'bg-slate-600'
          }`} 
          title={attacksUsed < 2 ? "Attack 2 available" : "Attack 2 used"}
        />
      </div>
    </div>
  );
}

export default PlayerChip;
