// API Client for the proxy server backend

const BASE_URL = '/api';

/**
 * Helper to execute fetch requests with basic error handling
 */
async function apiFetch(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Parse detailed error from the server if possible
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP error! Status: ${response.status}` };
      }
      
      const error = new Error(errorData.message || 'API request failed');
      error.status = response.status;
      error.code = errorData.error || 'API_ERROR';
      throw error;
    }
    
    return await response.json();
  } catch (err) {
    console.error(`🔴 API Fetch Error on ${url}:`, err);
    throw err;
  }
}

/**
 * API client exposing backend queries.
 * Note: tags usually contain '#' which must be URL encoded (e.g., %23).
 */
export const apiClient = {
  /**
   * Fetch current war details enriched with parsed enemy army compositions.
   */
  fetchWar: (clanTag) => {
    const encodedTag = encodeURIComponent(clanTag);
    return apiFetch(`/war/${encodedTag}`);
  },

  /**
   * Fetch player profile and parsed troop history.
   */
  fetchPlayer: (playerTag) => {
    const encodedTag = encodeURIComponent(playerTag);
    return apiFetch(`/player/${encodedTag}`);
  },

  /**
   * Fetch base clan information (validation/logos).
   */
  fetchClan: (clanTag) => {
    const encodedTag = encodeURIComponent(clanTag);
    return apiFetch(`/clan/${encodedTag}`);
  }
};
