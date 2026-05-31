// REQUIREMENT: OOP approach (2pt) - Grandchild constructor prototypal inheritance
import { ClanMember } from './ClanMember';

/**
 * EnemyMember constructor representing an opponent player in the war.
 * Inherits from ClanMember.
 */
export function EnemyMember(tag, name, thLevel, mapPosition, defenses, army) {
  ClanMember.call(this, tag, name, thLevel, mapPosition, 0);
  this.defenses = defenses || [];
  this.army = army || { mostUsed: [], recentArmies: [] };
}

// Inherit from ClanMember
EnemyMember.prototype = Object.create(ClanMember.prototype);
EnemyMember.prototype.constructor = EnemyMember;

/**
 * Retrieves the most used army composition for the enemy member.
 */
EnemyMember.prototype.getMostUsedArmy = function() {
  return this.army && this.army.mostUsed ? this.army.mostUsed : [];
};

/**
 * Calculates the average stars opponents got on this player's layout.
 */
EnemyMember.prototype.getAverageDefenseStars = function() {
  if (!this.defenses || this.defenses.length === 0) return 0;
  const sum = this.defenses.reduce((acc, def) => acc + (def.stars || 0), 0);
  return Number((sum / this.defenses.length).toFixed(1));
};

// Register under the CoCPlanner namespace
if (typeof window !== 'undefined') {
  window.CoCPlanner = window.CoCPlanner || {};
  window.CoCPlanner.Models = window.CoCPlanner.Models || {};
  window.CoCPlanner.Models.EnemyMember = EnemyMember;
}
