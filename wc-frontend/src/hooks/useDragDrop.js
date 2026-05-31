// REQUIREMENT: Advanced JS APIs (3pt) – Drag & Drop API, localStorage
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage Drag and Drop assignments state with localStorage persistence.
 * Supports up to 2 attackers assigned per enemy base layout.
 * @param {string} clanTag - The current clan tag (without #)
 */
export function useDragDrop(clanTag) {
  const key = clanTag ? `wc_plan_${clanTag.replace('#', '')}` : 'wc_plan_default';

  // Load initial assignments from localStorage
  const [assignments, setAssignments] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Failed to load plans from localStorage", e);
      return {};
    }
  });

  // Save to localStorage when assignments change
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(assignments));
    } catch (e) {
      console.error("Failed to save plans to localStorage", e);
    }
  }, [assignments, key]);

  /**
   * Assigns a player to an enemy target base.
   * Auto-rotates oldest player assignments if they exceed their available attack caps.
   * Auto-rotates oldest base attackers if more than 2 are assigned to 1 base.
   */
  const assignTarget = (enemyTag, playerData) => {
    setAssignments((prev) => {
      const updated = { ...prev };
      
      const inGameAttacks = playerData.inGameAttacks || 0;
      const maxPlannerAssignments = Math.max(0, 2 - inGameAttacks);

      // If the player has no attacks left in-game, we cannot assign them to anything
      if (maxPlannerAssignments <= 0) {
        return prev;
      }

      // Check if player is already assigned to this specific base
      if (updated[enemyTag]?.attackers?.some((atk) => atk.tag === playerData.tag)) {
        return prev;
      }

      // Find all target assignments already owned by this player tag
      const existing = [];
      for (const [targetTag, assigned] of Object.entries(updated)) {
        if (assigned && assigned.attackers) {
          const matchingAtk = assigned.attackers.find(atk => atk.tag === playerData.tag);
          if (matchingAtk) {
            existing.push({
              targetTag,
              assignedAt: matchingAtk.assignedAt || 0
            });
          }
        }
      }

      // Sort existing assignments by timestamp (oldest first)
      existing.sort((a, b) => a.assignedAt - b.assignedAt);

      // If they already have reached their max capacity, remove their oldest assignment
      if (existing.length >= maxPlannerAssignments) {
        const toRemoveCount = existing.length - maxPlannerAssignments + 1;
        for (let i = 0; i < toRemoveCount; i++) {
          const oldest = existing[i];
          if (oldest && updated[oldest.targetTag]?.attackers) {
            updated[oldest.targetTag] = { ...updated[oldest.targetTag] };
            updated[oldest.targetTag].attackers = updated[oldest.targetTag].attackers.filter(
              atk => atk.tag !== playerData.tag
            );
          }
        }
      }

      // Initialize slot immutably
      if (!updated[enemyTag]) {
        updated[enemyTag] = { notes: '', attackers: [] };
      } else {
        updated[enemyTag] = { ...updated[enemyTag] };
        updated[enemyTag].attackers = [...(updated[enemyTag].attackers || [])];
      }

      // Cap target base to at most 2 assigned attackers (auto-rotate oldest)
      if (updated[enemyTag].attackers.length >= 2) {
        const sortedAtks = [...updated[enemyTag].attackers].sort((a, b) => a.assignedAt - b.assignedAt);
        const oldestAtk = sortedAtks[0];
        updated[enemyTag].attackers = updated[enemyTag].attackers.filter(
          atk => atk.tag !== oldestAtk.tag
        );
      }

      // Assign the player
      updated[enemyTag].attackers.push({
        tag: playerData.tag,
        name: playerData.name,
        thLevel: playerData.thLevel,
        assignedAt: Date.now()
      });

      return updated;
    });
  };

  /**
   * Updates tactical notes for an enemy base.
   */
  const updateNotes = (enemyTag, notesText) => {
    setAssignments((prev) => {
      const updated = { ...prev };
      if (!updated[enemyTag]) {
        updated[enemyTag] = {
          attackers: [],
          notes: notesText
        };
      } else {
        updated[enemyTag] = {
          ...updated[enemyTag],
          notes: notesText
        };
      }
      return updated;
    });
  };

  /**
   * Reorders attackers within a target base assignment.
   */
  const reorderAttackers = (enemyTag, fromIndex, toIndex) => {
    setAssignments((prev) => {
      const updated = { ...prev };
      if (!updated[enemyTag] || !updated[enemyTag].attackers) return prev;
      
      const attackers = [...updated[enemyTag].attackers];
      if (fromIndex < 0 || fromIndex >= attackers.length || toIndex < 0 || toIndex >= attackers.length) return prev;

      const [moved] = attackers.splice(fromIndex, 1);
      attackers.splice(toIndex, 0, moved);

      updated[enemyTag] = { ...updated[enemyTag], attackers };
      return updated;
    });
  };

  /**
   * Imports a full plan object (e.g. from JSON file).
   */
  const importPlan = (planData) => {
    if (planData && typeof planData === 'object') {
      setAssignments(planData);
    }
  };

  /**
   * Removes assignment from a specific target (keeps notes).
   * If playerTag is provided, removes only that player. Otherwise clears all.
   */
  const unassignTarget = (enemyTag, playerTag = null) => {
    setAssignments((prev) => {
      if (!prev[enemyTag]) return prev;
      const updated = { ...prev };
      
      if (playerTag) {
        if (updated[enemyTag].attackers) {
          updated[enemyTag].attackers = updated[enemyTag].attackers.filter(
            (atk) => atk.tag !== playerTag
          );
        }
      } else {
        updated[enemyTag].attackers = [];
      }
      
      return updated;
    });
  };

  /**
   * Resets all target assignments.
   */
  const clearAssignments = () => {
    setAssignments({});
  };

  /**
   * Helper to compute which clan members have not yet been assigned to their maximum available bases.
   */
  const getUnassignedPlayers = (allPlayers = [], warState = 'preparation') => {
    const isPrep = warState === 'preparation';
    const counts = {};
    for (const assignment of Object.values(assignments)) {
      if (assignment && assignment.attackers) {
        for (const atk of assignment.attackers) {
          counts[atk.tag] = (counts[atk.tag] || 0) + 1;
        }
      }
    }
    return allPlayers.filter((p) => {
      const inGame = isPrep ? 0 : (p.attacksUsed || 0);
      const planned = counts[p.tag] || 0;
      return (inGame + planned) < 2;
    });
  };

  return {
    assignments,
    assignTarget,
    updateNotes,
    reorderAttackers,
    importPlan,
    unassignTarget,
    clearAssignments,
    getUnassignedPlayers
  };
}
