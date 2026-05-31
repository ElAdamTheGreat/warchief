import { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import { ClanMember, EnemyMember } from '../models';
import { getDemoWarData } from '../utils/demoWarData';

/**
 * Custom React hook to fetch war data by clan tag.
 * Automatically instantiates raw JSON responses into ClanMember and EnemyMember models.
 */
export function useWarData(clanTag) {
  const [warData, setWarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clanTag) {
      setWarData(null);
      return;
    }

    const formattedTag = clanTag.trim().toUpperCase().startsWith('#') 
      ? clanTag.trim().toUpperCase() 
      : '#' + clanTag.trim().toUpperCase();

    let active = true;
    setLoading(true);
    setError(null);

    if (formattedTag === '#2GJPRRV8P') {
      try {
        const data = getDemoWarData();
        
        // Instantiate OOP models from the local data
        const ourMembersMapped = (data.ourMembers || []).map(
          (m) => new ClanMember(m.tag, m.name, m.thLevel, m.mapPosition, m.attacksUsed)
        );

        const enemiesMapped = (data.enemies || []).map(
          (e) => new EnemyMember(e.tag, e.name, e.thLevel, e.mapPosition, e.defenses, e.army)
        );

        ourMembersMapped.sort((a, b) => a.mapPosition - b.mapPosition);
        enemiesMapped.sort((a, b) => a.mapPosition - b.mapPosition);

        if (active) {
          setWarData({
            ...data,
            ourMembers: ourMembersMapped,
            enemies: enemiesMapped
          });
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err);
          setLoading(false);
        }
      }
      return;
    }

    apiClient.fetchWar(clanTag)
      .then((data) => {
        if (!active) return;

        // Instantiate OOP models from the BFF DTO
        const ourMembersMapped = (data.ourMembers || []).map(
          (m) => new ClanMember(m.tag, m.name, m.thLevel, m.mapPosition, m.attacksUsed)
        );

        const enemiesMapped = (data.enemies || []).map(
          (e) => new EnemyMember(e.tag, e.name, e.thLevel, e.mapPosition, e.defenses, e.army)
        );

        // Sort by map position
        ourMembersMapped.sort((a, b) => a.mapPosition - b.mapPosition);
        enemiesMapped.sort((a, b) => a.mapPosition - b.mapPosition);

        setWarData({
          ...data,
          ourMembers: ourMembersMapped,
          enemies: enemiesMapped
        });
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clanTag]);

  return { warData, loading, error };
}
