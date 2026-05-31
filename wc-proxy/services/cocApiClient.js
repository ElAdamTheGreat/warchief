// =============================================================================
// services/cocApiClient.js – Supercell API fetch wrapper
// =============================================================================
// REQUIREMENT: services/cocApiClient.js – Supercell API wrapper with Bearer token auth
//
// Handles all HTTP communication with the official Clash of Clans API.
// Base URL: https://api.clashofclans.com/v1
// Auth: Bearer token from environment variable COC_API_KEY
// =============================================================================

const BASE_URL = 'https://api.clashofclans.com/v1';

/**
 * Makes an authenticated request to the Supercell API.
 * @param {string} endpoint - API endpoint path (e.g. '/clans/%23TAG/currentwar')
 * @returns {Promise<Object>} Parsed JSON response
 * @throws {Error} On non-2xx responses with descriptive message
 */
async function fetchFromApi(endpoint) {
  const apiKey = process.env.COC_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('COC_API_KEY is not configured. Set it in your .env file.');
  }

  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
  });

  // Handle specific error codes
  if (response.status === 404) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || 'Resource not found');
    error.status = 404;
    error.reason = errorBody.reason || 'notFound';
    throw error;
  }

  if (response.status === 403) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || 'Access denied');
    error.status = 403;
    error.reason = errorBody.reason || 'accessDenied';
    throw error;
  }

  if (response.status === 429) {
    const error = new Error('Supercell API rate limit exceeded. Try again later.');
    error.status = 429;
    throw error;
  }

  if (response.status === 503) {
    const error = new Error('Supercell API is under maintenance.');
    error.status = 503;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`Supercell API error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Encodes a player/clan tag for use in URL path.
 * '#2PP' → '%232PP'
 * @param {string} tag
 * @returns {string}
 */
function encodeTag(tag) {
  return encodeURIComponent(tag);
}

// ---------------------------------------------------------------------------
// Public API methods
// ---------------------------------------------------------------------------

/**
 * Fetch current war data for a clan.
 * @param {string} clanTag - e.g. '#2PP'
 * @returns {Promise<Object>} War data from Supercell API
 */
async function getCurrentWar(clanTag) {
  return fetchFromApi(`/clans/${encodeTag(clanTag)}/currentwar`);
}

/**
 * Fetch a player's battlelog (last 25 battles).
 * @param {string} playerTag - e.g. '#PLAYERTAG'
 * @returns {Promise<Array>} Array of battle objects
 */
async function getPlayerBattlelog(playerTag) {
  return fetchFromApi(`/players/${encodeTag(playerTag)}/battlelog`);
}

/**
 * Fetch a player's profile.
 * @param {string} playerTag
 * @returns {Promise<Object>} Player data
 */
async function getPlayer(playerTag) {
  return fetchFromApi(`/players/${encodeTag(playerTag)}`);
}

/**
 * Fetch clan info.
 * @param {string} clanTag
 * @returns {Promise<Object>} Clan data
 */
async function getClan(clanTag) {
  return fetchFromApi(`/clans/${encodeTag(clanTag)}`);
}

module.exports = {
  getCurrentWar,
  getPlayerBattlelog,
  getPlayer,
  getClan,
};
