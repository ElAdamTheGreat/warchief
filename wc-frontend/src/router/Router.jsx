// REQUIREMENT: Functional History (2pt) - SPA Router built on History API
import React, { useState, useEffect, createContext, useContext } from 'react';

// Create a context to hold router parameters
const RouterContext = createContext({ params: {}, path: '/' });

export const useRouter = () => useContext(RouterContext);

/**
 * Global navigation helper.
 * Uses History API to change URLs without a full page reload.
 */
export function navigate(path, state = null) {
  window.history.pushState(state, '', path);
  // Dispatch a popstate event manually so React router listeners receive the update
  window.dispatchEvent(new PopStateEvent('popstate', { state }));
}

/**
 * Helper to match pathnames to pattern structures like /war/:clanTag/enemy/:pos
 */
export function matchRoute(pattern, path) {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  return params;
}

/**
 * Custom router component.
 * Expects routes to be passed as an array of objects: { path, component }
 */
export function Router({ routes, fallback }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen to browser navigation (back/forward clicks) and our navigate() trigger
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Find the matching route and extract parameters
  let match = null;
  let params = {};

  for (const route of routes) {
    const matchedParams = matchRoute(route.path, currentPath);
    if (matchedParams) {
      match = route;
      params = matchedParams;
      break;
    }
  }

  // Handle fallback if no routes match
  const ActiveComponent = match ? match.component : fallback;

  return (
    <RouterContext.Provider value={{ params, path: currentPath }}>
      <ActiveComponent />
    </RouterContext.Provider>
  );
}
