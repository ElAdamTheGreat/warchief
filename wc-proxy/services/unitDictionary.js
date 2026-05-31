// =============================================================================
// services/unitDictionary.js – Unit ID → name/icon lookup
// =============================================================================
const path = require('path');
const fs = require('fs');

let troopsMap = null;
let spellsMap = null;
let heroesMap = null;

function loadDictionaries() {
  if (troopsMap && spellsMap && heroesMap) return;

  const dataDir = path.join(__dirname, '..', 'data');

  try {
    const troopsRaw = fs.readFileSync(path.join(dataDir, 'troops.json'), 'utf-8');
    troopsMap = new Map();
    const troopsData = JSON.parse(troopsRaw);
    for (const [id, unit] of Object.entries(troopsData)) {
      troopsMap.set(parseInt(id, 10), unit);
    }
  } catch (e) {
    console.warn("Could not load troops.json", e);
    troopsMap = new Map();
  }

  try {
    const spellsRaw = fs.readFileSync(path.join(dataDir, 'spells.json'), 'utf-8');
    spellsMap = new Map();
    const spellsData = JSON.parse(spellsRaw);
    for (const [id, unit] of Object.entries(spellsData)) {
      spellsMap.set(parseInt(id, 10), unit);
    }
  } catch (e) {
    console.warn("Could not load spells.json", e);
    spellsMap = new Map();
  }

  try {
    const heroesRaw = fs.readFileSync(path.join(dataDir, 'heroes.json'), 'utf-8');
    heroesMap = new Map();
    const heroesData = JSON.parse(heroesRaw);
    for (const [id, unit] of Object.entries(heroesData)) {
      heroesMap.set(parseInt(id, 10), unit);
    }
  } catch (e) {
    console.warn("Could not load heroes.json", e);
    heroesMap = new Map();
  }
}

function lookupTroop(id) {
  loadDictionaries();
  return troopsMap.get(id) || null;
}

function lookupSpell(id) {
  loadDictionaries();
  return spellsMap.get(id) || null;
}

function lookupHero(id) {
  loadDictionaries();
  return heroesMap.get(id) || null;
}

module.exports = {
  lookupTroop,
  lookupSpell,
  lookupHero,
};
