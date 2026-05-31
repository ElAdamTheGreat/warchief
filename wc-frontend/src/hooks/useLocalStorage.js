// REQUIREMENT: LocalStorage (part of Advanced JS APIs, 3pt) - Persisting state using LocalStorage
import { useState, useEffect } from 'react';

/**
 * Custom hook to read and write state directly to browser LocalStorage.
 * Syncs automatically with JSON serialization.
 */
export function useLocalStorage(key, defaultValue) {
  // Read value initially
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`⚠️ Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  // Write value whenever state updates
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`⚠️ Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
