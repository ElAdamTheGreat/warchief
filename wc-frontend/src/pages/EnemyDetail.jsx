import React, { useState } from 'react';
import { useWar } from '../context/WarContext';
import { useRouter } from '../router/Router';
import { navigate } from '../router/Router';
import { ArmyPreview } from '../components/ArmyPreview';

/**
 * Render star icons for attack results.
 */
function Stars({ count }) {
  const stars = [];
  for (let i = 0; i < 3; i++) {
    stars.push(
      <span
        key={i}
        className={i < count ? 'text-amber-400' : 'text-slate-700'}
        style={{ fontSize: 18 }}
      >
        ★
      </span>
    );
  }
  return <span className="inline-flex gap-0.5">{stars}</span>;
}

export function EnemyDetail() {
  const { warData } = useWar();
  const { params } = useRouter();
  const [showRecent, setShowRecent] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Extract position from router params (set by /war/:clanTag/enemy/:pos)
  const pos = parseInt(params.pos, 10);

  // Navigate back to war dashboard
  const clanTag = params.clanTag || '';
  const goBack = () => navigate(`/war/${encodeURIComponent(clanTag)}`);

  // Find the enemy in warData
  const enemy =
    warData?.enemies?.find((e) => e.mapPosition === pos) ||
    warData?.opponents?.find((e) => e.mapPosition === pos) ||
    null;

  // --- Loading / error states ---
  if (!warData) {
    return (
      <main className="page-fade-in p-8 text-center text-slate-300">
        <p className="text-slate-500 font-body">No war data loaded.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-amber-500 hover:text-amber-400 text-sm font-body underline"
        >
          ← Back to Home
        </button>
      </main>
    );
  }

  if (!enemy) {
    return (
      <main className="page-fade-in p-8 text-center text-slate-300">
        <h1 className="text-2xl mb-4 font-headings">Enemy Not Found</h1>
        <p className="text-slate-500 font-body mb-4">
          No enemy at position <span className="text-amber-500 font-bold">#{pos}</span> in this war.
        </p>
        <button
          onClick={goBack}
          className="text-amber-500 hover:text-amber-400 text-sm font-body underline"
        >
          ← Back to Dashboard
        </button>
      </main>
    );
  }

  // Army data
  const mostUsed = enemy.army?.mostUsed || [];
  const recentArmies = enemy.army?.recentArmies || [];
  const defenses = enemy.defenses || [];
  const hasArmyData = mostUsed.length > 0 || recentArmies.length > 0;

  return (
    <main className="page-fade-in p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={goBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-400 font-body mb-6 transition-colors"
      >
        <span className="text-lg leading-none">←</span>
        <span>Back to Dashboard</span>
      </button>

      {/* ====== 3D Flip Card ====== */}
      <div
        className={`flip-card-container cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
        onClick={() => setIsFlipped((f) => !f)}
        style={{ height: 'auto', minHeight: 320 }}
      >
        <div className="flip-card-inner" style={{ height: 'auto', position: 'relative' }}>
          {/* ──── FRONT FACE ──── */}
          <div
            className="flip-card-front"
            style={{ position: isFlipped ? 'absolute' : 'relative' }}
          >
            {/* Header bar */}
            <div className="flex items-center gap-4 p-5 border-b border-white/5">
              {/* TH image */}
              <img
                src={`/town-halls/${enemy.thLevel}_small.webp`}
                alt={`Town Hall ${enemy.thLevel}`}
                className="w-14 h-14 object-contain flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = `/town-halls/${enemy.thLevel}.webp`;
                }}
              />

              <div className="flex-1 min-w-0 text-left">
                <h1 className="text-xl font-headings font-bold text-slate-100 truncate">
                  {enemy.name}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-body mt-0.5">
                  <span>
                    Map <span className="text-amber-500 font-bold">#{enemy.mapPosition}</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span>
                    TH <span className="text-sky-400 font-bold">{enemy.thLevel}</span>
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-slate-600 font-body italic hidden sm:block">
                Tap to flip
              </span>
            </div>

            {/* Army section */}
            <div className="p-5 text-left flex-1">
              {!hasArmyData ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 text-sm font-body italic">
                    No battle log data available
                  </p>
                </div>
              ) : (
                <>
                  {/* Most Used Army */}
                  <ArmyPreview army={mostUsed} title="Most Used Army" />

                  {/* Recent Armies – collapsible */}
                  {recentArmies.length > 0 && (
                    <div className="mt-5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent card flip
                          setShowRecent((s) => !s);
                        }}
                        className="text-xs font-bold text-amber-500 hover:text-amber-400 font-body tracking-wide transition-colors"
                      >
                        {showRecent
                          ? '▾ Hide recent armies'
                          : `▸ Show more armies (${recentArmies.length})`}
                      </button>

                      {showRecent && (
                        <div className="mt-3 space-y-4 border-l-2 border-white/5 pl-4">
                          {recentArmies.map((army, idx) => (
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
              )}
            </div>
          </div>

          {/* ──── BACK FACE ──── */}
          <div
            className="flip-card-back"
            style={{ position: isFlipped ? 'relative' : 'absolute', top: 0 }}
          >
            <div className="p-5 border-b border-white/5 text-left">
              <h2 className="text-lg font-headings font-bold text-slate-100">Defense History</h2>
              <p className="text-[10px] text-slate-600 font-body italic mt-0.5">
                Tap to flip back
              </p>
            </div>

            <div className="p-5 flex-1 text-left overflow-y-auto">
              {defenses.length === 0 ? (
                <p className="text-slate-600 text-sm font-body italic text-center py-8">
                  No defenses recorded
                </p>
              ) : (
                <ul className="space-y-3">
                  {defenses.map((def, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-body font-semibold text-slate-200 truncate">
                          {def.attackerName || 'Unknown'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Stars count={def.stars ?? 0} />
                          <span className="text-xs text-slate-500 font-body">
                            {def.destruction != null ? `${def.destruction}%` : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Visual destruction bar */}
                      <div className="w-20 h-1.5 rounded-full bg-slate-800 ml-3 flex-shrink-0 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(def.destruction ?? 0, 100)}%`,
                            background:
                              (def.destruction ?? 0) >= 100
                                ? 'var(--color-green)'
                                : (def.destruction ?? 0) >= 50
                                  ? 'var(--color-gold)'
                                  : 'var(--color-red)',
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default EnemyDetail;
