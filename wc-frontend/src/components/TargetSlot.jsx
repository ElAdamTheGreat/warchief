// REQUIREMENT: Advanced JS APIs (3pt) – ondragover, ondrop
import React, { useState } from 'react';

export function TargetSlot({ enemy, assignment, onDrop, onRemove, onReorder }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [justDropped, setJustDropped] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    // Check if this is a reorder drop
    try {
      const reorderData = e.dataTransfer.getData('application/x-reorder');
      if (reorderData) {
        // Handled by the child's onDrop, we can just return here or let it propagate.
        // Actually, if we drop on the container but not on an item, we might append to bottom.
        // We'll let the child handle exact position swaps.
        return;
      }
    } catch (err) {}

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const playerData = JSON.parse(dataStr);
        onDrop(enemy.tag, playerData);
        
        // Trigger temporary bounce animation on successful drop
        setJustDropped(true);
        setTimeout(() => setJustDropped(false), 800);
      }
    } catch (err) {
      console.error("Failed to process drop", err);
    }
  };

  const thImgSrc = `/town-halls/${enemy.thLevel || 1}_small.webp`;
  const attackers = assignment && assignment.attackers ? assignment.attackers : [];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative p-3.5 rounded-xl border flex flex-col justify-between min-h-[105px] h-auto transition-all duration-300 ${
        isDragOver
          ? 'border-dashed border-amber-500 bg-amber-500/5 shadow-[0_0_15px_rgba(244,164,35,0.15)] scale-[1.01]'
          : justDropped
            ? 'border-emerald-500 bg-emerald-500/5 drop-success-bounce'
            : 'bg-[#1a1d28] border-white/5 shadow-md'
      }`}
    >
      {/* Enemy Tag / ID Badge */}
      <div className="flex items-center justify-between w-full min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="flex items-center justify-center w-5 h-5 rounded bg-[#252836] text-[10px] font-bold text-amber-500 border border-white/10 flex-shrink-0">
            {enemy.mapPosition}
          </span>
          <span className="font-headings font-bold text-[11px] text-slate-300 truncate">
            {enemy.name}
          </span>
        </div>
        
        {/* Sleek Enemy Town Hall Pill */}
        <div className="flex items-center gap-1 bg-[#252836] border border-white/5 pl-1.5 pr-2 py-0.5 rounded-full flex-shrink-0">
          <img
            src={thImgSrc}
            alt={`Enemy TH ${enemy.thLevel}`}
            className="w-3.5 h-3.5 object-contain"
            onError={(e) => {
              e.currentTarget.src = '/town-halls/1_small.webp';
            }}
          />
          <span className="text-[8px] font-extrabold text-slate-400 font-body uppercase leading-none">
            TH{enemy.thLevel}
          </span>
        </div>
      </div>

      {/* Full-width Row 2 - renders multiple stacked assigned attackers if present */}
      <div className="w-full mt-2.5 flex-grow flex flex-col gap-1.5 justify-center">
        {attackers.length > 0 ? (
          attackers.map((atk, index) => {
            const assignedThImgSrc = `/town-halls/${atk.thLevel || 1}_small.webp`;
            return (
              <div 
                key={atk.tag}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  e.dataTransfer.setData('application/x-reorder', index.toString());
                }}
                onDragOver={(e) => {
                  e.preventDefault(); // allow drop
                }}
                onDrop={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const fromIndexStr = e.dataTransfer.getData('application/x-reorder');
                  if (fromIndexStr && onReorder) {
                    const fromIndex = parseInt(fromIndexStr, 10);
                    onReorder(enemy.tag, fromIndex, index);
                  }
                }}
                className="w-full flex items-center justify-between gap-2 bg-[#252836]/60 hover:bg-[#252836]/80 p-1.5 rounded-lg border border-white/5 shadow-inner transition-colors duration-200 cursor-move"
                title="Drag to reorder primary/secondary attackers"
              >
                <div className="flex items-center gap-2 min-w-0 pointer-events-none">
                  {/* Assigned Player TH icon */}
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-[#0f1117]/80 rounded-md border border-white/5 shadow-inner">
                    <img
                      src={assignedThImgSrc}
                      alt={`TH ${atk.thLevel}`}
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/town-halls/1_small.webp';
                      }}
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headings font-bold text-[11px] text-emerald-400 truncate leading-tight">
                      {atk.name}
                    </span>
                    <span className="text-[7.5px] text-slate-500 font-semibold font-body leading-none mt-0.5 uppercase tracking-wide">
                      {index === 0 ? 'Primary Attacker' : 'Secondary Attacker'}
                    </span>
                  </div>
                </div>
                
                {/* Remove Attacker Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(enemy.tag, atk.tag);
                  }}
                  className="w-4.5 h-4.5 flex-shrink-0 flex items-center justify-center rounded-md bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-600 text-[8px] text-red-400 shadow-sm transition-all duration-200"
                >
                  ✕
                </button>
              </div>
            );
          })
        ) : (
          <div className="w-full h-full min-h-[46px] flex items-center justify-center border border-dashed border-slate-700/50 hover:border-amber-500/40 rounded-xl bg-slate-900/10 hover:bg-amber-500/[0.02] text-[9px] text-slate-500 hover:text-amber-500/70 font-body select-none font-semibold uppercase tracking-wider italic transition-all duration-300">
            Drag Attacker Here
          </div>
        )}
      </div>
    </div>
  );
}

export default TargetSlot;
