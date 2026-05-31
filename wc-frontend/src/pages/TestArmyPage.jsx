import React, { useState } from 'react';
import { ArmyPreview } from '../components/ArmyPreview';
import { navigate } from '../router/Router';

export function TestArmyPage() {
  const defaultCode = 'u1x0-2x1-3x3-4x2-5x4-6x5-7x6-1x7-2x8-3x9-4x23-5x24';
  const [armyCode, setArmyCode] = useState(defaultCode);
  
  // Custom parser in frontend so we don't even need a proxy query for this test page!
  const parseCodeInFrontend = (code) => {
    const parsedUnits = [];
    
    // Clean up code: if it is a full url, get the army parameter
    let armyStr = code;
    if (code.includes('army=')) {
      const match = code.match(/army=([a-zA-Z0-9\-_]+)/);
      if (match) {
        armyStr = match[1];
      }
    }

    // Comprehensive copy link dictionaries
    const heroDict = {
      0: { name: "Barbarian King", type: "hero" },
      1: { name: "Archer Queen", type: "hero" },
      2: { name: "Grand Warden", type: "hero" },
      4: { name: "Royal Champion", type: "hero" },
      6: { name: "Minion Prince", type: "hero" },
      7: { name: "Dragon Duke", type: "hero" }
    };

    const petDict = {
      0: "Lassi",
      1: "Mighty Yak",
      2: "Electro Owl",
      3: "Unicorn",
      4: "Phoenix",
      7: "Poison Lizard",
      8: "Diggy",
      9: "Frosty",
      10: "Spirit Fox",
      11: "Angry Jelly",
      16: "Sneezy",
      17: "Greedy Raven"
    };

    const equipDict = {
      0: { name: "Barbarian Puppet",  epic: false },
      1: { name: "Rage Vial",         epic: false },
      2: { name: "Archer Puppet",     epic: false },
      3: { name: "Invisibility Vial", epic: false },
      4: { name: "Eternal Tome",      epic: false },
      5: { name: "Life Gem",          epic: false },
      6: { name: "Seeking Shield",    epic: false },
      7: { name: "Royal Gem",         epic: false },
      8: { name: "Earthquake Boots",  epic: false },
      9: { name: "Hog Rider Puppet",  epic: false },
      10: { name: "Giant Gauntlet",    epic: true  },
      11: { name: "Vampstache",        epic: false },
      12: { name: "Haste Vial",        epic: false },
      13: { name: "Rocket Spear",      epic: true  },
      14: { name: "Spiky Ball",        epic: true  },
      15: { name: "Frozen Arrow",      epic: true  },
      17: { name: "Giant Arrow",       epic: false },
      19: { name: "Heroic Torch",      epic: true  },
      20: { name: "Healer Puppet",     epic: false },
      22: { name: "Fireball",          epic: true  },
      24: { name: "Rage Gem",          epic: false },
      32: { name: "Snake Bracelet",    epic: true  },
      34: { name: "Healing Tome",      epic: false },
      35: { name: "Dark Crown",        epic: true  },
      39: { name: "Magic Mirror",      epic: true  },
      40: { name: "Electro Boots",     epic: true  },
      41: { name: "Lavaloon Puppet",   epic: true  },
      42: { name: "Henchmen Puppet",   epic: false },
      43: { name: "Dark Orb",          epic: false },
      44: { name: "Metal Pants",       epic: false },
      47: { name: "Noble Iron",        epic: false },
      48: { name: "Action Figure",     epic: true  },
      49: { name: "Meteor Staff",      epic: true  },
      50: { name: "Frost Flake",       epic: true  },
      51: { name: "Stick Horse",       epic: true  },
      52: { name: "Fire Heart",        epic: false },
      53: { name: "Rocket Backpack",   epic: true  },
      56: { name: "Stun Blaster",      epic: false },
      57: { name: "Flame Blower",      epic: false },
      59: { name: "Electro Fangs",     epic: false }
    };

    const troopDict = {
      0:   { name: "Barbarian",         type: "troop" },
      1:   { name: "Archer",            type: "troop" },
      2:   { name: "Goblin",            type: "troop" },
      3:   { name: "Giant",             type: "troop" },
      4:   { name: "Wall Breaker",      type: "troop" },
      5:   { name: "Balloon",           type: "troop" },
      6:   { name: "Wizard",            type: "troop" },
      7:   { name: "Healer",            type: "troop" },
      8:   { name: "Dragon",            type: "troop" },
      9:   { name: "P.E.K.K.A",         type: "troop" },
      10:  { name: "Minion",            type: "troop" },
      11:  { name: "Hog Rider",         type: "troop" },
      12:  { name: "Valkyrie",          type: "troop" },
      13:  { name: "Golem",             type: "troop" },
      15:  { name: "Witch",             type: "troop" },
      17:  { name: "Lava Hound",        type: "troop" },
      22:  { name: "Bowler",            type: "troop" },
      23:  { name: "Baby Dragon",       type: "troop" },
      24:  { name: "Miner",             type: "troop" },
      26:  { name: "Super Barbarian",   type: "super" },
      27:  { name: "Super Archer",      type: "super" },
      28:  { name: "Super Wall Breaker",type: "super" },
      29:  { name: "Super Giant",       type: "super" },
      51:  { name: "Wall Wrecker",      type: "siege" },
      52:  { name: "Battle Blimp",      type: "siege" },
      53:  { name: "Yeti",              type: "troop" },
      55:  { name: "Sneaky Goblin",     type: "super" },
      56:  { name: "Super Miner",       type: "super" },
      57:  { name: "Rocket Balloon",    type: "super" },
      58:  { name: "Ice Golem",         type: "troop" },
      59:  { name: "Electro Dragon",    type: "troop" },
      62:  { name: "Stone Slammer",     type: "siege" },
      63:  { name: "Inferno Dragon",    type: "super" },
      64:  { name: "Super Valkyrie",    type: "super" },
      65:  { name: "Dragon Rider",      type: "troop" },
      66:  { name: "Super Witch",       type: "super" },
      71:  { name: "Hog Rider",         type: "troop" },
      75:  { name: "Siege Barracks",    type: "siege" },
      76:  { name: "Ice Hound",         type: "super" },
      80:  { name: "Super Bowler",      type: "super" },
      81:  { name: "Super Dragon",      type: "super" },
      82:  { name: "Headhunter",        type: "troop" },
      83:  { name: "Super Wizard",      type: "super" },
      84:  { name: "Super Minion",      type: "super" },
      87:  { name: "Log Launcher",      type: "siege" },
      91:  { name: "Flame Flinger",     type: "siege" },
      92:  { name: "Battle Drill",      type: "siege" },
      95:  { name: "Electro Titan",     type: "troop" },
      97:  { name: "Apprentice Warden", type: "troop" },
      98:  { name: "Super Hog Rider",   type: "super" },
      110: { name: "Root Rider",        type: "troop" },
      123: { name: "Druid",             type: "troop" },
      132: { name: "Thrower",           type: "troop" },
      135: { name: "Troop Launcher",    type: "siege" },
      147: { name: "Super Yeti",        type: "super" },
      150: { name: "Furnace",           type: "troop" },
      177: { name: "Meteor Golem",      type: "troop" },
      188: { name: "Sky Wagon",         type: "siege" }
    };

    const spellDict = {
      0:   { name: "Lightning Spell",    type: "spell" },
      1:   { name: "Healing Spell",      type: "spell" },
      2:   { name: "Rage Spell",         type: "spell" },
      3:   { name: "Jump Spell",         type: "spell" },
      5:   { name: "Freeze Spell",       type: "spell" },
      9:   { name: "Poison Spell",       type: "spell" },
      10:  { name: "Earthquake Spell",   type: "spell" },
      11:  { name: "Haste Spell",        type: "spell" },
      16:  { name: "Clone Spell",        type: "spell" },
      17:  { name: "Skeleton Spell",     type: "spell" },
      28:  { name: "Bat Spell",          type: "spell" },
      35:  { name: "Invisibility Spell", type: "spell" },
      53:  { name: "Recall Spell",       type: "spell" },
      70:  { name: "Overgrowth Spell",   type: "spell" },
      98:  { name: "Revive Spell",       type: "spell" },
      109: { name: "Ice Block Spell",    type: "spell" },
      120: { name: "Totem Spell",        type: "spell" }
    };

    // Scan for segments
    const regex = /([hidus])([^hidus]+)/g;
    let match;
    while ((match = regex.exec(armyStr)) !== null) {
      const prefix = match[1];
      const content = match[2];

      if (prefix === 'h') {
        const segments = content.split('-');
        segments.forEach(seg => {
          if (!seg) return;
          const m = seg.match(/^(\d+)(?:m\d+)?(?:p(\d+))?(?:e(\d+)(?:_(\d+))?)?/);
          if (m) {
            const heroId = parseInt(m[1], 10);
            const heroInfo = heroDict[heroId];
            
            // Extract pet
            let pet = null;
            if (m[2]) {
              const petId = parseInt(m[2], 10);
              const petName = petDict[petId];
              if (petName) {
                pet = { id: petId, name: petName };
              }
            }

            // Extract equipment
            let equip1 = null;
            let equip2 = null;
            if (m[3]) {
              const equip1Id = parseInt(m[3], 10);
              const eq1Info = equipDict[equip1Id];
              if (eq1Info) {
                equip1 = { id: equip1Id, name: eq1Info.name, epic: eq1Info.epic };
              }
            }
            if (m[4]) {
              const equip2Id = parseInt(m[4], 10);
              const eq2Info = equipDict[equip2Id];
              if (eq2Info) {
                equip2 = { id: equip2Id, name: eq2Info.name, epic: eq2Info.epic };
              }
            }

            parsedUnits.push({
              unitId: heroId,
              count: 1,
              name: heroInfo ? heroInfo.name : `Unknown Hero #${heroId}`,
              type: 'hero',
              pet,
              equip1,
              equip2
            });
          }
        });
      } else {
        const segments = content.split('-');
        segments.forEach(seg => {
          const parts = seg.split('x');
          if (parts.length === 2) {
            const count = parseInt(parts[0], 10);
            const unitId = parseInt(parts[1], 10);
            if (!isNaN(count) && !isNaN(unitId)) {
              let info = null;
              let type = 'troop';

              if (prefix === 'u') {
                info = troopDict[unitId];
                type = info ? info.type : 'troop';
              } else if (prefix === 's') {
                info = spellDict[unitId];
                type = 'spell';
              } else if (prefix === 'i') {
                info = troopDict[unitId];
                type = 'cc';
              } else if (prefix === 'd') {
                info = spellDict[unitId];
                type = 'cc';
              }

              parsedUnits.push({
                unitId,
                count,
                name: info ? info.name : `Unknown #${unitId}`,
                type
              });
            }
          }
        });
      }
    }

    return parsedUnits;
  };

  const parsedArmy = parseCodeInFrontend(armyCode);

  return (
    <main className="page-fade-in flex-grow pb-16 max-w-4xl mx-auto px-4 mt-8">
      <div className="bg-[#1a1d28]/70 border border-white/5 p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h1 className="font-headings font-black text-2xl text-white tracking-wide">
              ARMY COPY LINK TEST PAGE
            </h1>
            <p className="text-xs text-slate-500 font-body mt-1">
              Verifying 1:1 Clash of Clans 64px card styling and outline font legibility.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-headings rounded-lg uppercase text-xs shadow-md shadow-amber-500/10 transition-all"
          >
            ← Home
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Clash of Clans Army Code / Copy Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={armyCode}
              onChange={(e) => {
                const val = e.target.value;
                // If full url, extract query param
                if (val.includes('army=')) {
                  const match = val.match(/army=([a-zA-Z0-9\-_]+)/);
                  if (match) {
                    setArmyCode(match[1]);
                    return;
                  }
                }
                setArmyCode(val);
              }}
              className="flex-grow font-mono text-xs p-3 focus:border-amber-500 focus:outline-none"
              placeholder="e.g. u1x0-2x1..."
            />
            <button
              onClick={() => setArmyCode(defaultCode)}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-headings font-bold rounded-lg transition-all uppercase"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Display Container */}
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-6 space-y-4">
          <h3 className="font-headings font-black text-sm text-amber-500 uppercase tracking-wider">
            FAVORITE WAR ARMY COMPOSITION (64PX)
          </h3>
          <div className="py-4 flex justify-center bg-[#151722]/50 border border-white/5 rounded-xl">
            <ArmyPreview army={parsedArmy} tileSize={64} />
          </div>
        </div>

        {/* Visual Specs Validation Box */}
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
          <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            🎨 Visual Specs Checked:
          </h4>
          <ul className="text-xs text-slate-400 font-body list-disc pl-4 space-y-1">
            <li>Troop cards scale precisely to **64px** width (78px height).</li>
            <li>Numbers (`x1`, `x2`, `x3`...) use the official **Clash** gaming font.</li>
            <li>Weird backdrops and thick fuzzy shadows are removed in favor of a **very thin 1px black outline text-shadow** for high readability.</li>
            <li>Gradients, borders, and `object-cover` alignments match the game client 1:1.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}

export default TestArmyPage;
