/**
 * High-Fidelity local mock data generator for featured clan The Rushers (#2GJPRRV8P).
 * Simulates a continuous 48-hour war cycle relative to current system time,
 * automatically looping between Preparation Day (0-24h) and Battle Day (24-48h).
 */
export function getDemoWarData() {
  const cycleMs = 48 * 60 * 60 * 1000; // 48 hours
  const now = Date.now();
  const remainder = now % cycleMs;
  
  let state = 'preparation';
  let startTimeIso = '';
  let endTimeIso = '';
  
  if (remainder < 24 * 60 * 60 * 1000) {
    // Preparation day (first 24h of cycle)
    state = 'preparation';
    const startMs = now + (24 * 60 * 60 * 1000 - remainder);
    const endMs = startMs + (24 * 60 * 60 * 1000);
    startTimeIso = new Date(startMs).toISOString();
    endTimeIso = new Date(endMs).toISOString();
  } else {
    // Battle day (second 24h of cycle)
    state = 'inWar';
    const endMs = now + (48 * 60 * 60 * 1000 - remainder);
    const startMs = endMs - (24 * 60 * 60 * 1000);
    startTimeIso = new Date(startMs).toISOString();
    endTimeIso = new Date(endMs).toISOString();
  }
  
  return {
    war: {
      state,
      teamSize: 10,
      startTime: startTimeIso,
      endTime: endTimeIso
    },
    clan: {
      tag: '#2GJPRRV8P',
      name: 'The Rushers',
      level: 15,
      stars: state === 'preparation' ? 0 : 18,
      destructionPercentage: state === 'preparation' ? 0.0 : 78.5
    },
    opponent: {
      tag: '#2CPYGYJJV',
      name: 'KINHCOC',
      level: 14,
      stars: state === 'preparation' ? 0 : 16,
      destructionPercentage: state === 'preparation' ? 0.0 : 71.2
    },
    ourMembers: [
      { tag: '#PLR1', name: 'Kraslik', thLevel: 14, mapPosition: 1, attacksUsed: state === 'preparation' ? 0 : 1 },
      { tag: '#PLR2', name: 'spartan007', thLevel: 14, mapPosition: 2, attacksUsed: state === 'preparation' ? 0 : 0 },
      { tag: '#PLR3', name: 'MightyAdys', thLevel: 14, mapPosition: 3, attacksUsed: state === 'preparation' ? 0 : 2 },
      { tag: '#PLR4', name: 'ElAdam', thLevel: 13, mapPosition: 4, attacksUsed: state === 'preparation' ? 0 : 1 },
      { tag: '#PLR5', name: 'Cukroušek', thLevel: 9, mapPosition: 5, attacksUsed: state === 'preparation' ? 0 : 0 },
      { tag: '#PLR6', name: 'ÿ4085', thLevel: 9, mapPosition: 6, attacksUsed: state === 'preparation' ? 0 : 1 },
      { tag: '#PLR7', name: 'kenzi_our', thLevel: 12, mapPosition: 7, attacksUsed: state === 'preparation' ? 0 : 0 },
      { tag: '#PLR8', name: 'DarkLord', thLevel: 11, mapPosition: 8, attacksUsed: state === 'preparation' ? 0 : 2 },
      { tag: '#PLR9', name: 'Sniper', thLevel: 10, mapPosition: 9, attacksUsed: state === 'preparation' ? 0 : 1 },
      { tag: '#PLR10', name: 'GamerX', thLevel: 9, mapPosition: 10, attacksUsed: state === 'preparation' ? 0 : 0 }
    ],
    enemies: [
      {
        tag: '#ENY1', name: 'ValkyrieKing', thLevel: 15, mapPosition: 1,
        defenses: state === 'preparation' ? [] : [{ attackerName: 'Kraslik', stars: 2, destruction: 85 }],
        army: {
          lastBattleTime: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'electro_dragon', name: 'Electro Dragon', type: 'troop', amount: 6, level: 6 },
            { id: 'balloon', name: 'Balloon', type: 'troop', amount: 8, level: 10 },
            { id: 'rage_spell', name: 'Rage Spell', type: 'spell', amount: 3, level: 6 },
            { id: 'freeze_spell', name: 'Freeze Spell', type: 'spell', amount: 5, level: 7 },
            { id: 'grand_warden', name: 'Grand Warden', type: 'hero', amount: 1, level: 40 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY2', name: 'ShadowNinja', thLevel: 14, mapPosition: 2,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'dragon', name: 'Dragon', type: 'troop', amount: 10, level: 9 },
            { id: 'balloon', name: 'Balloon', type: 'troop', amount: 4, level: 9 },
            { id: 'lightning_spell', name: 'Lightning Spell', type: 'spell', amount: 11, level: 10 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY3', name: 'PekkaMaster', thLevel: 14, mapPosition: 3,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'pekka', name: 'P.E.K.K.A', type: 'troop', amount: 5, level: 10 },
            { id: 'wizard', name: 'Wizard', type: 'troop', amount: 15, level: 11 },
            { id: 'rage_spell', name: 'Rage Spell', type: 'spell', amount: 5, level: 6 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY4', name: 'kenzi', thLevel: 13, mapPosition: 4,
        defenses: state === 'preparation' ? [] : [{ attackerName: 'ElAdam', stars: 3, destruction: 100 }],
        army: {
          lastBattleTime: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'electro_dragon', name: 'Electro Dragon', type: 'troop', amount: 6, level: 5 },
            { id: 'balloon', name: 'Balloon', type: 'troop', amount: 8, level: 9 },
            { id: 'rage_spell', name: 'Rage Spell', type: 'spell', amount: 3, level: 6 },
            { id: 'freeze_spell', name: 'Freeze Spell', type: 'spell', amount: 5, level: 7 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY5', name: 'DragonRider', thLevel: 12, mapPosition: 5,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 8 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'dragon', name: 'Dragon', type: 'troop', amount: 11, level: 7 },
            { id: 'rage_spell', name: 'Rage Spell', type: 'spell', amount: 4, level: 5 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY6', name: 'MinerManiac', thLevel: 11, mapPosition: 6,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 15 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'miner', name: 'Miner', type: 'troop', amount: 24, level: 5 },
            { id: 'hog_rider', name: 'Hog Rider', type: 'troop', amount: 12, level: 7 },
            { id: 'heal_spell', name: 'Healing Spell', type: 'spell', amount: 4, level: 7 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY7', name: 'GolemSmash', thLevel: 10, mapPosition: 7,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 18 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'golem', name: 'Golem', type: 'troop', amount: 3, level: 5 },
            { id: 'witch', name: 'Witch', type: 'troop', amount: 10, level: 3 },
            { id: 'bowler', name: 'Bowler', type: 'troop', amount: 10, level: 2 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY8', name: 'Lavaloon', thLevel: 9, mapPosition: 8,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 36 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'lava_hound', name: 'Lava Hound', type: 'troop', amount: 3, level: 4 },
            { id: 'balloon', name: 'Balloon', type: 'troop', amount: 20, level: 7 },
            { id: 'rage_spell', name: 'Rage Spell', type: 'spell', amount: 2, level: 5 },
            { id: 'haste_spell', name: 'Haste Spell', type: 'spell', amount: 4, level: 4 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY9', name: 'BarchKing', thLevel: 9, mapPosition: 9,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 22 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'barbarian', name: 'Barbarian', type: 'troop', amount: 100, level: 8 },
            { id: 'archer', name: 'Archer', type: 'troop', amount: 100, level: 8 }
          ],
          recentArmies: []
        }
      },
      {
        tag: '#ENY10', name: 'GiantFist', thLevel: 8, mapPosition: 10,
        defenses: [],
        army: {
          lastBattleTime: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
          mostUsed: [
            { id: 'giant', name: 'Giant', type: 'troop', amount: 16, level: 6 },
            { id: 'wizard', name: 'Wizard', type: 'troop', amount: 12, level: 6 },
            { id: 'heal_spell', name: 'Healing Spell', type: 'spell', amount: 3, level: 5 }
          ],
          recentArmies: []
        }
      }
    ]
  };
}
