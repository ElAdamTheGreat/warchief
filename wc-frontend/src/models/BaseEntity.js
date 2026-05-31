// REQUIREMENT: OOP approach (2pt) - Prototypal inheritance base constructor

/**
 * BaseEntity constructor representing any Clash of Clans entity.
 */
export function BaseEntity(tag, name) {
  this.tag = tag || '';
  this.name = name || '';
}

/**
 * Get entity display name with tag.
 */
BaseEntity.prototype.getDisplayName = function() {
  return `${this.name} (${this.tag})`;
};

// Register under the CoCPlanner namespace
if (typeof window !== 'undefined') {
  window.CoCPlanner = window.CoCPlanner || {};
  window.CoCPlanner.Models = window.CoCPlanner.Models || {};
  window.CoCPlanner.Models.BaseEntity = BaseEntity;
}
