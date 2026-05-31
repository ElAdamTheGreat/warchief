// =============================================================================
// services/dataTrimmer.js – BFF: strips raw API → clean DTO
// =============================================================================
// REQUIREMENT: services/dataTrimmer.js – BFF layer: strips raw Supercell API
//              response down to clean DTO. React never sees raw API structure.
//
// Strips: raw API metadata, redundant nested objects, internal Supercell IDs,
//         badge URLs, war league info, experience fields, etc.
// Keeps:  tag, name, thLevel, mapPosition, attacks, army
// =============================================================================

/**
 * Trims the full war response from Supercell API into a clean DTO
 * matching the BFF Response Shape defined in the implementation plan.
 *
 * @param {Object} rawWar - Raw war data from Supercell API
 * @param {Object} armyDataMap - Map of playerTag → { mostUsed, recentArmies }
 * @returns {Object} Trimmed war response (clean DTO)
 */
function trimWarResponse(rawWar, armyDataMap) {
  // War metadata
  const war = {
    state: rawWar.state || 'unknown',
    teamSize: rawWar.teamSize || 0,
    startTime: rawWar.startTime || null,
    endTime: rawWar.endTime || null,
  };

  // Our clan summary
  const clan = {
    tag: rawWar.clan?.tag || '',
    name: rawWar.clan?.name || '',
    stars: rawWar.clan?.stars || 0,
    destructionPercentage: rawWar.clan?.destructionPercentage || 0,
    level: rawWar.clan?.clanLevel || 0,
  };

  // Opponent clan summary
  const opponent = {
    tag: rawWar.opponent?.tag || '',
    name: rawWar.opponent?.name || '',
    stars: rawWar.opponent?.stars || 0,
    destructionPercentage: rawWar.opponent?.destructionPercentage || 0,
    level: rawWar.opponent?.clanLevel || 0,
  };

  // Our members (minimal fields for drag & drop planner)
  const ourMembers = (rawWar.clan?.members || []).map((member) => ({
    tag: member.tag,
    name: member.name,
    thLevel: member.townhallLevel || member.townHallLevel || 0,
    mapPosition: member.mapPosition || 0,
    attacksUsed: member.attacks ? member.attacks.length : 0,
  }));

  // Enemy members (enriched with army data)
  const enemies = (rawWar.opponent?.members || []).map((member) => {
    // Extract defenses from our attacks against this enemy
    const defenses = extractDefenses(rawWar.clan?.members || [], member.tag);

    // Get army data from the enrichment pipeline
    const army = armyDataMap[member.tag] || { mostUsed: [], recentArmies: [] };

    return {
      tag: member.tag,
      name: member.name,
      thLevel: member.townhallLevel || member.townHallLevel || 0,
      mapPosition: member.mapPosition || 0,
      defenses,
      army,
    };
  });

  // Sort by map position
  ourMembers.sort((a, b) => a.mapPosition - b.mapPosition);
  enemies.sort((a, b) => a.mapPosition - b.mapPosition);

  return { war, clan, opponent, ourMembers, enemies };
}

/**
 * Extracts attacks made against a specific defender from all clan members.
 *
 * @param {Array} clanMembers - Our clan's member list (with attacks)
 * @param {string} defenderTag - The enemy player's tag
 * @returns {Array<Object>} Array of { attackerName, stars, destruction }
 */
function extractDefenses(clanMembers, defenderTag) {
  const defenses = [];

  for (const member of clanMembers) {
    if (!member.attacks) continue;

    for (const attack of member.attacks) {
      if (attack.defenderTag === defenderTag) {
        defenses.push({
          attackerName: member.name,
          stars: attack.stars || 0,
          destruction: attack.destructionPercentage || 0,
        });
      }
    }
  }

  // Sort by stars descending, then destruction descending
  defenses.sort((a, b) => {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.destruction - a.destruction;
  });

  return defenses;
}

/**
 * Trims a single player response for the /api/player/:tag endpoint.
 *
 * @param {Object} rawPlayer - Raw player data from Supercell API
 * @param {Object} armies - { mostUsed, recentArmies } from army parser
 * @returns {Object} Trimmed player DTO
 */
function trimPlayerResponse(rawPlayer, armies) {
  return {
    tag: rawPlayer.tag,
    name: rawPlayer.name,
    thLevel: rawPlayer.townHallLevel || 0,
    trophies: rawPlayer.trophies || 0,
    warStars: rawPlayer.warStars || 0,
    attackWins: rawPlayer.attackWins || 0,
    defenseWins: rawPlayer.defenseWins || 0,
    clan: rawPlayer.clan
      ? { tag: rawPlayer.clan.tag, name: rawPlayer.clan.name }
      : null,
    army: armies,
  };
}

/**
 * Trims clan info for the /api/clan/:tag endpoint.
 *
 * @param {Object} rawClan - Raw clan data from Supercell API
 * @returns {Object} Trimmed clan DTO
 */
function trimClanResponse(rawClan) {
  return {
    tag: rawClan.tag,
    name: rawClan.name,
    level: rawClan.clanLevel || 0,
    members: rawClan.members || 0,
    warWins: rawClan.warWins || 0,
    warWinStreak: rawClan.warWinStreak || 0,
    isWarLogPublic: rawClan.isWarLogPublic || false,
    description: rawClan.description || '',
  };
}

module.exports = {
  trimWarResponse,
  trimPlayerResponse,
  trimClanResponse,
};
