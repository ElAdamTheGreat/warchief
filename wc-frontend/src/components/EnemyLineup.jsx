// REQUIREMENT: Semantic tags (1pt) – <section>
import React from 'react';
import { EnemyCard } from './EnemyCard';

export function EnemyLineup({ enemies = [], clanTag, selectedEnemyTag, onSelectEnemy, assignments = {} }) {
  // Sort enemies by mapPosition to ensure correct lineup ordering
  const sortedEnemies = [...enemies].sort((a, b) => a.mapPosition - b.mapPosition);

  return (
    <section className="enemy-lineup">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 font-headings flex items-center gap-2">
        <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
        Lineup & Assignments ({sortedEnemies.length})
      </h2>
      
      {sortedEnemies.length === 0 ? (
        <div className="text-center py-8 bg-[#1a1d28]/40 border border-white/5 rounded-xl text-slate-500 font-body">
          No enemies found.
        </div>
      ) : (
        <div className="enemy-lineup-list flex flex-col">
          {sortedEnemies.map((enemy, index) => (
            <EnemyCard
              key={enemy.tag}
              enemy={enemy}
              clanTag={clanTag}
              index={index}
              isSelected={selectedEnemyTag === enemy.tag}
              onSelect={() => onSelectEnemy && onSelectEnemy(enemy)}
              assignment={assignments[enemy.tag] || null}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default EnemyLineup;
