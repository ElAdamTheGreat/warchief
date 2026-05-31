// REQUIREMENT: OOP approach (2pt) - Namespace and object-oriented structure setup
import { BaseEntity } from './BaseEntity';
import { ClanMember } from './ClanMember';
import { EnemyMember } from './EnemyMember';

// Initialize the namespace structure on the window object
if (typeof window !== 'undefined') {
  window.CoCPlanner = window.CoCPlanner || {};
  window.CoCPlanner.Models = window.CoCPlanner.Models || {};
  window.CoCPlanner.Utils = window.CoCPlanner.Utils || {};
  window.CoCPlanner.Config = window.CoCPlanner.Config || {};
  
  // Attach utilities
  window.CoCPlanner.Utils.formatTag = formatTag;
  window.CoCPlanner.Utils.calculateStars = calculateStars;
}

/**
 * Format tag: Enforces uppercase and leading hash '#' sign.
 */
export function formatTag(tag) {
  if (!tag) return '';
  let formatted = tag.trim().toUpperCase();
  if (!formatted.startsWith('#')) {
    formatted = '#' + formatted;
  }
  return formatted;
}

/**
 * Star logic based on destruction percent (simplified gaming logic).
 */
export function calculateStars(destructionPercent) {
  if (destructionPercent >= 100) return 3;
  if (destructionPercent >= 50) return 2;
  if (destructionPercent > 0) return 1;
  return 0;
}

export { BaseEntity, ClanMember, EnemyMember };
