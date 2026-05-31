// REQUIREMENT: OOP approach (2pt) - Prototypal inheritance child constructor
import { BaseEntity } from './BaseEntity';

/**
 * ClanMember constructor representing a player in our clan.
 * Inherits from BaseEntity.
 */
export function ClanMember(tag, name, thLevel, mapPosition, attacksUsed) {
  BaseEntity.call(this, tag, name);
  this.thLevel = thLevel || 0;
  this.mapPosition = mapPosition || 0;
  this.attacksUsed = attacksUsed || 0;
}

// Inherit from BaseEntity
ClanMember.prototype = Object.create(BaseEntity.prototype);
ClanMember.prototype.constructor = ClanMember;

/**
 * Checks if the player is at the maximum Town Hall level.
 */
ClanMember.prototype.isMaxTH = function() {
  return this.thLevel >= 16;
};

// Register under the CoCPlanner namespace
if (typeof window !== 'undefined') {
  window.CoCPlanner = window.CoCPlanner || {};
  window.CoCPlanner.Models = window.CoCPlanner.Models || {};
  window.CoCPlanner.Models.ClanMember = ClanMember;
}
