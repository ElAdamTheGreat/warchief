// =============================================================================
// services/armyParser.js – armyShareCode parser
// =============================================================================
const unitDictionary = require('./unitDictionary');

/**
 * Parses a single armyShareCode string into an array of unit objects.
 *
 * @param {string} code - The armyShareCode string (e.g. "u1x0-2x1s1x5")
 * @returns {Array<Object>} Parsed army composition
 */
function parseArmyShareCode(code) {
  if (!code || typeof code !== 'string') {
    return [];
  }

  const parsedUnits = [];  // Authoritative copy-link dictionaries sourced from clash-armies-master DB migrations
  // Source: C:\WebyVS\clash-armies-master\src\lib\server\migration\v0_3_0.ts, v0_5_0.ts, v0_8_0.ts
  // Hero clashIds: utils.ts HERO_CLASH_IDS (BK=0,AQ=1,GW=2,RC=4,MP=6,DD=7)
  const heroDict = {
    0: { name: "Barbarian King",  type: "hero" },
    1: { name: "Archer Queen",    type: "hero" },
    2: { name: "Grand Warden",    type: "hero" },
    4: { name: "Royal Champion",  type: "hero" },
    6: { name: "Minion Prince",   type: "hero" },
    7: { name: "Dragon Duke",     type: "hero" }
  };

  const troopDict = {
    0:   { name: "Barbarian",         type: "troop" },
    1:   { name: "Archer",            type: "troop" },
    2:   { name: "Goblin",            type: "troop" },
    3:   { name: "Giant",             type: "troop" },
    4:   { name: "Wall Breaker",      type: "troop" },
    5:   { name: "Balloon",           type: "troop" },
    6:   { name: "Wizard",            type: "troop" },
    7:   { name: "Healer",            type: "troop" },
    8:   { name: "Dragon",            type: "troop" },
    9:   { name: "P.E.K.K.A",         type: "troop" },
    10:  { name: "Minion",            type: "troop" },
    11:  { name: "Hog Rider",         type: "troop" },
    12:  { name: "Valkyrie",          type: "troop" },
    13:  { name: "Golem",             type: "troop" },
    15:  { name: "Witch",             type: "troop" },
    17:  { name: "Lava Hound",        type: "troop" },
    22:  { name: "Bowler",            type: "troop" },
    23:  { name: "Baby Dragon",       type: "troop" },
    24:  { name: "Miner",             type: "troop" },
    26:  { name: "Super Barbarian",   type: "super" },
    27:  { name: "Super Archer",      type: "super" },
    28:  { name: "Super Wall Breaker",type: "super" },
    29:  { name: "Super Giant",       type: "super" },
    51:  { name: "Wall Wrecker",      type: "siege" },
    52:  { name: "Battle Blimp",      type: "siege" },
    53:  { name: "Yeti",              type: "troop" },
    55:  { name: "Sneaky Goblin",     type: "super" },
    56:  { name: "Super Miner",       type: "super" },
    57:  { name: "Rocket Balloon",    type: "super" },
    58:  { name: "Ice Golem",         type: "troop" },
    59:  { name: "Electro Dragon",    type: "troop" },
    62:  { name: "Stone Slammer",     type: "siege" },
    63:  { name: "Inferno Dragon",    type: "super" },
    64:  { name: "Super Valkyrie",    type: "super" },
    65:  { name: "Dragon Rider",      type: "troop" },
    66:  { name: "Super Witch",       type: "super" },
    71:  { name: "Hog Rider",         type: "troop" },
    75:  { name: "Siege Barracks",    type: "siege" },
    76:  { name: "Ice Hound",         type: "super" },
    80:  { name: "Super Bowler",      type: "super" },
    81:  { name: "Super Dragon",      type: "super" },
    82:  { name: "Headhunter",        type: "troop" },
    83:  { name: "Super Wizard",      type: "super" },
    84:  { name: "Super Minion",      type: "super" },
    87:  { name: "Log Launcher",      type: "siege" },
    91:  { name: "Flame Flinger",     type: "siege" },
    92:  { name: "Battle Drill",      type: "siege" },
    95:  { name: "Electro Titan",     type: "troop" },
    97:  { name: "Apprentice Warden", type: "troop" },
    98:  { name: "Super Hog Rider",   type: "super" },
    110: { name: "Root Rider",        type: "troop" },
    123: { name: "Druid",             type: "troop" },
    132: { name: "Thrower",           type: "troop" },
    135: { name: "Troop Launcher",    type: "siege" },
    147: { name: "Super Yeti",        type: "super" },
    150: { name: "Furnace",           type: "troop" },
    177: { name: "Meteor Golem",      type: "troop" },
    188: { name: "Sky Wagon",         type: "siege" }
  };

  // Spell clashIds strip the "26000" prefix (e.g. 26000010 -> 10 = Earthquake)
  const spellDict = {
    0:   { name: "Lightning Spell",    type: "spell" },
    1:   { name: "Healing Spell",      type: "spell" },
    2:   { name: "Rage Spell",         type: "spell" },
    3:   { name: "Jump Spell",         type: "spell" },
    5:   { name: "Freeze Spell",       type: "spell" },
    9:   { name: "Poison Spell",       type: "spell" },
    10:  { name: "Earthquake Spell",   type: "spell" },
    11:  { name: "Haste Spell",        type: "spell" },
    16:  { name: "Clone Spell",        type: "spell" },
    17:  { name: "Skeleton Spell",     type: "spell" },
    28:  { name: "Bat Spell",          type: "spell" },
    35:  { name: "Invisibility Spell", type: "spell" },
    53:  { name: "Recall Spell",       type: "spell" },
    70:  { name: "Overgrowth Spell",   type: "spell" },
    98:  { name: "Revive Spell",       type: "spell" },
    109: { name: "Ice Block Spell",    type: "spell" },
    120: { name: "Totem Spell",        type: "spell" }
  };

  // Pet clashIds from v0_3_0.ts petClashIDs + v0_5_0.ts Greedy Raven
  const petDict = {
    0:  { name: "Lassi" },
    1:  { name: "Mighty Yak" },
    2:  { name: "Electro Owl" },
    3:  { name: "Unicorn" },
    4:  { name: "Phoenix" },
    7:  { name: "Poison Lizard" },
    8:  { name: "Diggy" },
    9:  { name: "Frosty" },
    10: { name: "Spirit Fox" },
    11: { name: "Angry Jelly" },
    16: { name: "Sneezy" },
    17: { name: "Greedy Raven" }
  };

  // Equipment clashIds from v0_3_0.ts equipmentClashIDs + v0_5_0.ts + v0_8_0.ts
  // epic: true = purple background, epic: false = blue background
  const equipDict = {
    0:  { name: "Barbarian Puppet",  epic: false },
    1:  { name: "Rage Vial",         epic: false },
    2:  { name: "Archer Puppet",     epic: false },
    3:  { name: "Invisibility Vial", epic: false },
    4:  { name: "Eternal Tome",      epic: false },
    5:  { name: "Life Gem",          epic: false },
    6:  { name: "Seeking Shield",    epic: false },
    7:  { name: "Royal Gem",         epic: false },
    8:  { name: "Earthquake Boots",  epic: false },
    9:  { name: "Hog Rider Doll",    epic: false },
    10: { name: "Giant Gauntlet",    epic: true  },
    11: { name: "Vampstache",        epic: false },
    12: { name: "Haste Vial",        epic: false },
    13: { name: "Rocket Spear",      epic: true  },
    14: { name: "Spiky Ball",        epic: true  },
    15: { name: "Frozen Arrow",      epic: true  },
    17: { name: "Giant Arrow",       epic: false },
    19: { name: "Heroic Torch",      epic: true  },
    20: { name: "Healer Puppet",     epic: false },
    22: { name: "Fireball",          epic: true  },
    24: { name: "Rage Gem",          epic: false },
    32: { name: "Snake Bracelet",    epic: true  },
    34: { name: "Healing Tome",      epic: false },
    35: { name: "Dark Crown",        epic: true  },
    39: { name: "Magic Mirror",      epic: true  },
    40: { name: "Electro Boots",     epic: true  },
    41: { name: "Lavaloon Puppet",   epic: true  },
    42: { name: "Henchmen Puppet",   epic: false },
    43: { name: "Dark Orb",          epic: false },
    44: { name: "Metal Pants",       epic: false },
    47: { name: "Noble Iron",        epic: false },
    48: { name: "Action Figure",     epic: true  },
    49: { name: "Meteor Staff",      epic: true  },
    50: { name: "Frost Flake",       epic: true  },
    51: { name: "Stick Horse",       epic: true  },
    52: { name: "Fire Heart",        epic: false },
    53: { name: "Rocket Backpack",   epic: true  },
    56: { name: "Stun Blaster",      epic: false },
    57: { name: "Flame Blower",      epic: false },
    59: { name: "Electro Fangs",     epic: false }
  };

  const regex = /([hidus])([^hidus]+)/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const prefix = match[1];
    const content = match[2];

    if (prefix === 'h') {
      const segments = content.split('-');
      segments.forEach(seg => {
        if (!seg) return;
        const m = seg.match(/^(\d+)(?:m\d+)?(?:p(\d+))?(?:e(\d+)(?:_(\d+))?)?/);
        if (m) {
          const heroId = parseInt(m[1], 10);
          const heroInfo = heroDict[heroId];
          
          let pet = null;
          if (m[2]) {
            const petId = parseInt(m[2], 10);
            const petName = petDict[petId];
            if (petName) pet = { id: petId, name: petName.name };
          }

          let equip1 = null;
          let equip2 = null;
          if (m[3]) {
            const equip1Id = parseInt(m[3], 10);
            const eq1Info = equipDict[equip1Id];
            if (eq1Info) equip1 = { id: equip1Id, name: eq1Info.name, epic: eq1Info.epic };
          }
          if (m[4]) {
            const equip2Id = parseInt(m[4], 10);
            const eq2Info = equipDict[equip2Id];
            if (eq2Info) equip2 = { id: equip2Id, name: eq2Info.name, epic: eq2Info.epic };
          }

          parsedUnits.push({
            unitId: heroId,
            count: 1,
            name: heroInfo ? heroInfo.name : `Unknown Hero #${heroId}`,
            type: 'hero',
            pet,
            equip1,
            equip2
          });
        }
      });
    } else {
      const segments = content.split('-');
      segments.forEach(seg => {
        const parts = seg.split('x');
        if (parts.length === 2) {
          const count = parseInt(parts[0], 10);
          const unitId = parseInt(parts[1], 10);
          if (!isNaN(count) && !isNaN(unitId)) {
            let info = null;
            let type = 'troop';

            if (prefix === 'u') {
              info = troopDict[unitId];
              type = info ? info.type : 'troop';
            } else if (prefix === 's') {
              info = spellDict[unitId];
              type = 'spell';
            } else if (prefix === 'i') {
              info = troopDict[unitId];
              type = 'cc';
            } else if (prefix === 'd') {
              info = spellDict[unitId];
              type = 'cc';
            }

            parsedUnits.push({
              unitId,
              count,
              name: info ? info.name : `Unknown #${unitId}`,
              type
            });
          }
        }
      });
    }
  }

  return parsedUnits;
}

/**
 * Helper to parse COC DateTime string (YYYYMMDDTHHMMSS.000Z) to standard ISO string
 */
function parseCocDateTime(cocStr) {
  if (!cocStr || typeof cocStr !== 'string' || cocStr.length < 15) {
    return null;
  }
  try {
    const year = cocStr.substring(0, 4);
    const month = cocStr.substring(4, 6);
    const day = cocStr.substring(6, 8);
    const hour = cocStr.substring(9, 11);
    const min = cocStr.substring(11, 13);
    const sec = cocStr.substring(13, 15);
    return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}.000Z`).toISOString();
  } catch (e) {
    return null;
  }
}

/**
 * Processes a player's battlelog and extracts army compositions.
 * Returns the most-used army, last 3 recent armies, and last battle time.
 *
 * @param {Array} battlelog - Array of battle objects from Supercell API
 * @returns {Object} { mostUsed: Array, recentArmies: Array, lastBattleTime: String }
 */
function parsePlayerBattlelog(battlelogInput) {
  const battlelog = (battlelogInput && Array.isArray(battlelogInput.items))
    ? battlelogInput.items
    : (Array.isArray(battlelogInput) ? battlelogInput : []);

  if (!battlelog.length) {
    return { mostUsed: [], recentArmies: [], lastBattleTime: null };
  }

  let lastBattleTime = null;
  for (const battle of battlelog) {
    if (battle.battleTime) {
      lastBattleTime = parseCocDateTime(battle.battleTime);
      break;
    }
  }

  // Prioritize ranked attacks for our primary army aggregation
  const rankedBattles = battlelog.filter((b) => b.battleType === 'ranked');
  const targetBattles = rankedBattles.length > 0 ? rankedBattles : battlelog;

  const parsedArmies = [];
  for (const battle of targetBattles) {
    const armyCode =
      battle.attacker?.armyShareCode ||
      battle.armyShareCode ||
      null;

    if (armyCode) {
      const parsed = parseArmyShareCode(armyCode);
      if (parsed.length > 0) {
        parsedArmies.push({ code: armyCode, parsed });
      }
    }
  }

  // For recent armies, gather from all battles but put ranked ones first
  const allParsedArmies = [];
  const orderedBattles = [...rankedBattles, ...battlelog.filter((b) => b.battleType !== 'ranked')];
  
  for (const battle of orderedBattles) {
    const armyCode =
      battle.attacker?.armyShareCode ||
      battle.armyShareCode ||
      null;

    if (armyCode) {
      const parsed = parseArmyShareCode(armyCode);
      if (parsed.length > 0) {
        // Unique check to avoid duplicate compositions in recents list
        const codeSig = JSON.stringify(parsed);
        if (!allParsedArmies.some((ex) => JSON.stringify(ex) === codeSig)) {
          allParsedArmies.push(parsed);
        }
      }
    }
  }

  // Recent armies – last 3 unique compositions
  const recentArmies = allParsedArmies.slice(0, 3);

  // Most-used army – aggregate unit counts across targeted battles
  const mostUsed = aggregateMostUsedArmy(parsedArmies);

  return {
    mostUsed,
    recentArmies,
    lastBattleTime,
  };
}

/**
 * Identifies the single most frequently used army composition among all battles.
 *
 * @param {Array<Object>} armies - Array of { code, parsed } army compositions
 * @returns {Array<Object>} Most frequently used army composition
 */
function aggregateMostUsedArmy(armies) {
  if (!armies.length) return [];

  // Group and count frequency of each armyShareCode
  const frequencies = {};
  for (const item of armies) {
    const code = item.code;
    if (!code) continue;
    if (!frequencies[code]) {
      frequencies[code] = {
        parsed: item.parsed,
        count: 0
      };
    }
    frequencies[code].count++;
  }

  // Find the code with the highest frequency
  let bestCode = null;
  let maxCount = -1;
  for (const code of Object.keys(frequencies)) {
    if (frequencies[code].count > maxCount) {
      maxCount = frequencies[code].count;
      bestCode = code;
    }
  }

  if (bestCode) {
    return frequencies[bestCode].parsed;
  }

  // Fallback if no code grouping could be made
  if (armies[0]) {
    return armies[0].parsed || (Array.isArray(armies[0]) ? armies[0] : []);
  }

  return [];
}

module.exports = {
  parseArmyShareCode,
  parsePlayerBattlelog,
  aggregateMostUsedArmy,
};
