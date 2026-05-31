// =============================================================================
// routes/api.js – API route handlers
// =============================================================================
// REQUIREMENT: routes/api.js – endpoints: GET /api/war/:clanTag, GET /api/player/:playerTag
//
// Data flow:
//   1. cocApiClient fetches raw data from Supercell API
//   2. armyParser parses armyShareCode strings from battlelogs
//   3. dataTrimmer strips raw response → clean DTO
// =============================================================================

const express = require('express');
const router = express.Router();
const { apiLimiter } = require('../middleware/rateLimiter');
const cocApiClient = require('../services/cocApiClient');
const armyParser = require('../services/armyParser');
const dataTrimmer = require('../services/dataTrimmer');

// Apply rate limiting to all API routes
router.use(apiLimiter);

// ---------------------------------------------------------------------------
// GET /api/war/:clanTag
// Main endpoint – fetches war data, enriches with army compositions, trims
// ---------------------------------------------------------------------------
router.get('/war/:clanTag', async (req, res, next) => {
  try {
    const { clanTag } = req.params;

    // Ensure tag starts with #
    const formattedTag = clanTag.startsWith('#') ? clanTag : `#${clanTag}`;

    console.log(`\n📡 Fetching war data for clan: ${formattedTag}`);

    // Step 1 – Fetch current war data
    const warData = await cocApiClient.getCurrentWar(formattedTag);

    // Handle "not in war" states
    if (warData.state === 'notInWar') {
      return res.status(404).json({
        error: 'notInWar',
        message: `Clan ${formattedTag} is not currently in a war.`,
      });
    }

    if (warData.reason === 'accessDenied' || warData.reason === 'accessDenied.invalidIp') {
      return res.status(403).json({
        error: 'accessDenied',
        message: 'War log is private or API key IP mismatch.',
      });
    }

    // Step 2 – Fetch battlelogs for each opponent member & parse armies
    const opponentMembers = warData.opponent?.members || warData.opponent?.memberList || [];
    console.log(`   Found ${opponentMembers.length} opponent members. Fetching battlelogs...`);

    const armyDataMap = {};
    const battlelogPromises = opponentMembers.map(async (member) => {
      try {
        const battlelog = await cocApiClient.getPlayerBattlelog(member.tag);
        const armies = armyParser.parsePlayerBattlelog(battlelog);
        armyDataMap[member.tag] = armies;
      } catch (err) {
        // Graceful degradation – if we can't get battlelog, just skip
        console.warn(`   ⚠️  Could not fetch battlelog for ${member.name} (${member.tag}): ${err.message}`);
        armyDataMap[member.tag] = { mostUsed: [], recentArmies: [] };
      }
    });

    await Promise.allSettled(battlelogPromises);
    console.log(`   ✅ Battlelogs processed.`);

    // Step 3 – Trim & enrich war data (BFF pattern)
    const trimmedResponse = dataTrimmer.trimWarResponse(warData, armyDataMap);

    res.json(trimmedResponse);

  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/player/:playerTag
// Single player lookup (for EnemyDetail page – optional extra data)
// ---------------------------------------------------------------------------
router.get('/player/:playerTag', async (req, res, next) => {
  try {
    const { playerTag } = req.params;
    const formattedTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;

    console.log(`📡 Fetching player data for: ${formattedTag}`);

    // Fetch player profile
    const playerData = await cocApiClient.getPlayer(formattedTag);

    // Fetch battlelog & parse armies
    let armies = { mostUsed: [], recentArmies: [] };
    try {
      const battlelog = await cocApiClient.getPlayerBattlelog(formattedTag);
      armies = armyParser.parsePlayerBattlelog(battlelog);
    } catch (err) {
      console.warn(`   ⚠️  Could not fetch battlelog for ${formattedTag}: ${err.message}`);
    }

    // Trim player data
    const trimmedPlayer = dataTrimmer.trimPlayerResponse(playerData, armies);

    res.json(trimmedPlayer);

  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/clan/:clanTag
// Clan info lookup (for validation & header display)
// ---------------------------------------------------------------------------
router.get('/clan/:clanTag', async (req, res, next) => {
  try {
    const { clanTag } = req.params;
    const formattedTag = clanTag.startsWith('#') ? clanTag : `#${clanTag}`;

    const clanData = await cocApiClient.getClan(formattedTag);
    const trimmedClan = dataTrimmer.trimClanResponse(clanData);

    res.json(trimmedClan);

  } catch (err) {
    next(err);
  }
});

module.exports = router;
