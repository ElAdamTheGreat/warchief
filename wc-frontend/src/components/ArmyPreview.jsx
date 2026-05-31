import React, { useState, useEffect } from 'react';

/**
 * Background gradients matching clash-armies-master Svelte project.
 * Keys are lowercased `type` values from the army data shape.
 */
const GRADIENT_MAP = {
  troop: 'linear-gradient(0deg, hsl(207, 64%, 45%) 0%, hsl(203, 100%, 66%) 100%)',
  siege: 'linear-gradient(0deg, hsl(207, 64%, 45%) 0%, hsl(203, 100%, 66%) 100%)',
  spell: 'linear-gradient(0deg, hsl(251, 65%, 57%) 0%, hsl(252, 68%, 62%) 100%)',
  super: 'linear-gradient(0deg, hsl(357, 51%, 27%) 0%, hsl(2, 45%, 47%) 100%)',
};

/**
 * Helper to identify Clash of Clans super troops
 */
function isSuperTroop(unit) {
  if (!unit || !unit.name) return false;
  const name = unit.name.toLowerCase();
  return (
    name.startsWith('super ') ||
    name.startsWith('sneaky ') ||
    name === 'rocket balloon' ||
    name === 'ice hound' ||
    name === 'inferno dragon'
  );
}

/**
 * Resolves correct small webp troop/spell image path from public/troops or public/heroes
 */
function getUnitImageSrc(unit) {
  let name = unit.name || '';
  
  if (name.toLowerCase().endsWith(' spell')) {
    name = name.replace(/\s+Spell$/i, '');
  }
  
  if (!name && unit.icon) {
    name = unit.icon.replace(/\.(png|webp)$/i, '');
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Handle heroes (loaded from /heroes/ with no _small suffix)
  if (unit.type === 'hero') {
    return `/heroes/${name}.webp`;
  }
  
  return `/troops/${name}_small.webp`;
}

/**
 * Renders a single unit tile (icon + count banner overlay).
 */
function UnitTile({ unit, size = 64 }) {
  const imgSrc = getUnitImageSrc(unit);
  const cardWidth = size;
  const cardHeight = Math.round(size * 1.22);
  const bannerHeight = Math.round(size * 0.28);
  const fontSize = Math.round(size * 0.22);
  
  // Decide gradients based on unit type and supertroop status
  let cardBg = 'linear-gradient(0deg, hsl(207, 64%, 45%) 0%, hsl(203, 100%, 66%) 100%)'; // blue default
  let bannerBg = 'linear-gradient(0deg, rgba(57, 110, 164, 1) 0%, rgba(78, 146, 210, 1) 100%)';
  
  const type = (unit.type || '').toLowerCase();
  
  if (type === 'hero') {
    // dark blue or grey for heroes
    cardBg = 'linear-gradient(0deg, #1b1c25 0%, #3d4156 100%)';
    bannerBg = 'linear-gradient(0deg, #10111a 0%, #202330 100%)';
  } else if (isSuperTroop(unit) || type === 'super') {
    // red background is for supertroops
    cardBg = 'linear-gradient(0deg, hsl(357, 51%, 27%) 0%, hsl(2, 45%, 47%) 100%)';
    bannerBg = 'linear-gradient(0deg, rgb(114, 48, 53) 0%, rgba(133, 13, 19, 1) 100%)';
  }

  const count = unit.count || unit.amount || 1;
  const showBanner = count && (unit.type !== 'hero' || count > 1);

  return (
    <div
      className="relative flex flex-col items-center justify-between flex-shrink-0 select-none overflow-hidden transition-all duration-200"
      style={{
        width: cardWidth,
        height: cardHeight,
        borderRadius: 6,
        background: cardBg,
        border: '1.5px solid #3d4156',
        boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
      }}
      title={`${unit.name} x${count}`}
    >
      {/* Top Banner overlay */}
      {showBanner && (
        <div
          className="w-full flex items-center justify-center border-b border-[#1b1c25]/60 z-10 shrink-0"
          style={{
            height: bannerHeight,
            background: bannerBg,
          }}
        >
          <span
            className="select-none flex items-center justify-center w-full h-full text-white"
            style={{
              fontFamily: "'Clash', sans-serif",
              fontWeight: 'normal',
              fontSize: fontSize,
              lineHeight: 1,
              marginTop: '1.5px',
              WebkitTextStroke: '1px #000',
              textShadow: 'none',
            }}
          >
            x{count}
          </span>
        </div>
      )}

      {/* Unit image below banner */}
      <div className="relative w-full flex-grow overflow-hidden flex items-center justify-center">
        <img
          src={imgSrc}
          alt={unit.name}
          draggable={false}
          className="w-full h-full object-contain pointer-events-none"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

/**
 * Authoritative housing space lookup map sourced directly from clash-armies game data.
 */
const HOUSING_SPACE_MAP = {
  // Troops
  "Barbarian": 1,
  "Archer": 1,
  "Goblin": 1,
  "Giant": 5,
  "Wall Breaker": 2,
  "Balloon": 5,
  "Wizard": 4,
  "Healer": 14,
  "Dragon": 20,
  "P.E.K.K.A": 25,
  "Minion": 2,
  "Hog Rider": 5,
  "Valkyrie": 8,
  "Golem": 30,
  "Witch": 12,
  "Lava Hound": 30,
  "Bowler": 6,
  "Baby Dragon": 10,
  "Miner": 6,
  "Super Barbarian": 5,
  "Super Archer": 12,
  "Super Wall Breaker": 8,
  "Super Giant": 10,
  "Ice Golem": 15,
  "Electro Dragon": 30,
  "Yeti": 18,
  "Sneaky Goblin": 3,
  "Super Miner": 24,
  "Rocket Balloon": 8,
  "Inferno Dragon": 15,
  "Super Valkyrie": 20,
  "Dragon Rider": 25,
  "Super Witch": 40,
  "Ice Hound": 40,
  "Super Bowler": 30,
  "Super Dragon": 40,
  "Headhunter": 6,
  "Super Wizard": 10,
  "Super Minion": 12,
  "Electro Titan": 32,
  "Apprentice Warden": 20,
  "Super Hog Rider": 12,
  "Root Rider": 20,
  "Druid": 16,
  "Thrower": 16,
  "Super Yeti": 24,
  "Furnace": 18,
  "Meteor Golem": 40,
  "Water Dragon": 50,

  // Sieges
  "Wall Wrecker": 1,
  "Battle Blimp": 1,
  "Stone Slammer": 1,
  "Siege Barracks": 1,
  "Siege Log Launcher": 1,
  "Log Launcher": 1,
  "Flame Flinger": 1,
  "Battle Drill": 1,
  "Troop Launcher": 1,
  "Sky Wagon": 1,

  // Spells
  "Lightning Spell": 1,
  "Healing Spell": 2,
  "Rage Spell": 2,
  "Jump Spell": 2,
  "Freeze Spell": 1,
  "Poison Spell": 1,
  "Earthquake Spell": 1,
  "Haste Spell": 1,
  "Clone Spell": 3,
  "Skeleton Spell": 1,
  "Bat Spell": 1,
  "Invisibility Spell": 1,
  "Recall Spell": 2,
  "Overgrowth Spell": 2,
  "Ice Block Spell": 1,
  "Revive Spell": 2,
  "Totem Spell": 1
};

/**
 * Identifies if a unit is a siege machine.
 */
function isSiegeUnit(unit) {
  if (!unit || !unit.name) return false;
  const name = unit.name.toLowerCase();
  return (
    name.includes('wrecker') ||
    name.includes('blimp') ||
    name.includes('slammer') ||
    name.includes('barracks') ||
    name.includes('launcher') ||
    name.includes('flinger') ||
    name.includes('drill')
  );
}

/**
 * ArmyPreview – displays a single army composition as horizontal unit tiles.
 *
 * @param {Object}   props
 * @param {Array}    props.army   – array of { name, count, type, icon }
 * @param {string}   [props.title] – optional label rendered above the tiles
 * @param {number}   [props.tileSize] – tile dimension in px (default 58)
 */
export function ArmyPreview({ army, title, tileSize = 64 }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 640px)');
    const listener = (e) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const activeTileSize = isMobile ? Math.round(tileSize * 0.75) : tileSize;
  const hasArmy = Array.isArray(army) && army.length > 0;

  if (!hasArmy) {
    return <p className="text-xs text-slate-600 italic py-2 font-body">No army data</p>;
  }

  // Filter into categories
  const heroes = army.filter(u => u.type === 'hero');
  const troops = army.filter(u => u.type === 'troop' || u.type === 'super');
  const spells = army.filter(u => u.type === 'spell');
  const siege = army.filter(u => u.type === 'siege');
  const cc = army.filter(u => u.type === 'cc');

  // Unified Army calculations
  const armyUnits = [...troops, ...spells, ...siege];
  const getUnitHousingSpace = (unit) => HOUSING_SPACE_MAP[unit.name] || 1;
  const getCount = (u) => u.count || u.amount || 1;

  const armyTroopSpace = troops.reduce((sum, u) => sum + (getCount(u) * getUnitHousingSpace(u)), 0);
  const armySpellSpace = spells.reduce((sum, u) => sum + (getCount(u) * getUnitHousingSpace(u)), 0);
  const armySiegeSpace = siege.reduce((sum, u) => sum + getCount(u), 0);

  // Unified CC calculations
  const ccTroops = cc.filter(u => !u.name.endsWith(' Spell') && !isSiegeUnit(u));
  const ccSpells = cc.filter(u => u.name.endsWith(' Spell'));
  const ccSieges = cc.filter(u => isSiegeUnit(u));

  const ccUnits = [...ccTroops, ...ccSpells, ...ccSieges];
  const ccTroopSpace = ccTroops.reduce((sum, u) => sum + (getCount(u) * getUnitHousingSpace(u)), 0);
  const ccSpellSpace = ccSpells.reduce((sum, u) => sum + (getCount(u) * getUnitHousingSpace(u)), 0);
  const ccSiegeSpace = ccSieges.reduce((sum, u) => sum + getCount(u), 0);

  const renderHousingStats = (troopSpace, spellSpace, siegeSpace) => {
    return (
      <div className="flex items-center gap-3 bg-[#0a0b10]/40 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
        {/* Troops Housing Space */}
        {troopSpace > 0 && (
          <div className="flex items-center gap-1.5 justify-center" title="Troops Housing Space">
            <img 
              src="/icons/housing_troop.png" 
              className="w-5 h-5 object-contain" 
              alt="Troops" 
            />
            <span className="text-[12px] text-slate-100 font-bold leading-none mt-[1px]" style={{ fontFamily: "'Clash', sans-serif", WebkitTextStroke: '0.5px #000' }}>
              {troopSpace}
            </span>
          </div>
        )}
        
        {/* Spells Housing Space */}
        {spellSpace > 0 && (
          <div className="flex items-center gap-1.5 justify-center" title="Spells Housing Space">
            <img 
              src="/icons/housing_spell.png" 
              className="w-5 h-5 object-contain" 
              alt="Spells" 
            />
            <span className="text-[12px] text-slate-100 font-bold leading-none mt-[1px]" style={{ fontFamily: "'Clash', sans-serif", WebkitTextStroke: '0.5px #000' }}>
              {spellSpace}
            </span>
          </div>
        )}

        {/* Siege Machine Housing Space */}
        {siegeSpace > 0 && (
          <div className="flex items-center gap-1.5 justify-center" title="Siege Machines Count">
            <img 
              src="/icons/housing_siege.png" 
              className="w-5 h-5 object-contain" 
              alt="Sieges" 
            />
            <span className="text-[12px] text-slate-100 font-bold leading-none mt-[1px]" style={{ fontFamily: "'Clash', sans-serif", WebkitTextStroke: '0.5px #000' }}>
              {siegeSpace}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderRow = (units, label, rightElement = null) => {
    if (units.length === 0) return null;
    const isHeroRow = label === "Heroes & Pets";
    
    return (
      <div className="space-y-2 p-3.5 bg-[#0f1117]/65 border border-white/5 rounded-xl shadow-inner relative overflow-hidden transition-all duration-300 hover:border-amber-500/10 hover:shadow-lg">
        {/* Row Label */}
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[10px] font-bold text-amber-500/90 uppercase tracking-wider font-headings flex items-center gap-1.5 select-none">
            <span className="w-1.5 h-2.5 bg-amber-500 rounded-sm"></span>
            {label}
          </h4>
          {rightElement}
        </div>
        
        {/* Horizontal Tiles Grid */}
        <div className="flex flex-wrap items-center gap-3">
          {isHeroRow ? (
            units.map((hero, idx) => {
              const equipSize = Math.max(12, Math.round(activeTileSize * 0.44));
              const gapSize = Math.max(2, Math.round(activeTileSize * 0.08));
              return (
                <div
                  key={`${hero.name}-${idx}`}
                  className="flex items-center bg-[#1b1c25]/30 p-1.5 rounded-xl border border-white/5 shadow-md"
                  style={{ gap: gapSize }}
                >
                  {/* Left: Large Hero Card */}
                  <UnitTile unit={hero} size={activeTileSize} />
                  
                  {/* Right: Equipment & Pet Column */}
                  <div className="flex flex-col shrink-0 justify-center" style={{ gap: gapSize }}>
                    {/* Top Row: Two Equipments */}
                    <div className="flex" style={{ gap: gapSize }}>
                      {hero.equip1 ? (
                        <div
                          className="rounded border border-white/10 overflow-hidden shadow-inner transition-all"
                          style={{
                            width: equipSize,
                            height: equipSize,
                            background: hero.equip1.epic
                              ? 'linear-gradient(315deg, rgba(146, 40, 202, 1) 0%, rgba(187, 65, 245, 1) 100%)'
                              : 'linear-gradient(315deg, rgba(16, 124, 198, 1) 0%, rgba(48, 184, 253, 1) 100%)'
                          }}
                          title={hero.equip1.name}
                        >
                          <img
                            src={`/heroes/equipment/${hero.equip1.name}.webp`}
                            className="w-full h-full object-cover animate-fade-in"
                            onError={(e) => {
                              e.currentTarget.src = `/heroes/equipment/${hero.equip1.name}_small.webp`;
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="rounded border border-dashed border-white/10 bg-[#0f1117]/50"
                          style={{ width: equipSize, height: equipSize }}
                        />
                      )}
                      {hero.equip2 ? (
                        <div
                          className="rounded border border-white/10 overflow-hidden shadow-inner transition-all"
                          style={{
                            width: equipSize,
                            height: equipSize,
                            background: hero.equip2.epic
                              ? 'linear-gradient(315deg, rgba(146, 40, 202, 1) 0%, rgba(187, 65, 245, 1) 100%)'
                              : 'linear-gradient(315deg, rgba(16, 124, 198, 1) 0%, rgba(48, 184, 253, 1) 100%)'
                          }}
                          title={hero.equip2.name}
                        >
                          <img
                            src={`/heroes/equipment/${hero.equip2.name}.webp`}
                            className="w-full h-full object-cover animate-fade-in"
                            onError={(e) => {
                              e.currentTarget.src = `/heroes/equipment/${hero.equip2.name}_small.webp`;
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="rounded border border-dashed border-white/10 bg-[#0f1117]/50"
                          style={{ width: equipSize, height: equipSize }}
                        />
                      )}
                    </div>
                    {/* Bottom Row: Pet */}
                    {hero.pet ? (
                      <div
                        className="rounded border border-white/10 overflow-hidden bg-gradient-to-b from-[#4b5563] to-[#1f2937] shadow-inner transition-all self-start"
                        style={{ width: equipSize, height: equipSize }}
                        title={hero.pet.name}
                      >
                        <img
                          src={`/heroes/pets/${hero.pet.name}.webp`}
                          className="w-full h-full object-cover animate-fade-in"
                        />
                      </div>
                    ) : (
                      <div
                        className="rounded border border-dashed border-white/10 bg-[#0f1117]/50 self-start"
                        style={{ width: equipSize, height: equipSize }}
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            units.map((unit, idx) => (
              <UnitTile key={`${unit.name}-${idx}`} unit={unit} size={activeTileSize} />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="army-preview space-y-4 w-full">
      {title && (
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-headings">
          {title}
        </p>
      )}
      
      {renderRow(heroes, "Heroes & Pets")}
      {renderRow(armyUnits, "Army", renderHousingStats(armyTroopSpace, armySpellSpace, armySiegeSpace))}
      {renderRow(ccUnits, "Clan Castle", renderHousingStats(ccTroopSpace, ccSpellSpace, ccSiegeSpace))}
    </div>
  );
}

export default ArmyPreview;
