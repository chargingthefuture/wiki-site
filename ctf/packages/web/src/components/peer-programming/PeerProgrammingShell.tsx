import React, { useEffect, useState } from 'react';
import { getCohorts } from '../../lib/peer-programming/repository';
import { Cohort } from '../../lib/peer-programming/types';

export function PeerProgrammingShell() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCohorts()
      .then(setCohorts)
      .catch(() => setError('Failed to load cohorts'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (cohorts.length === 0) return <div>No cohorts available. Check back soon!</div>;

  return (
    <div>
      <h2>Peer Programming Cohorts</h2>
      <ul>
        {cohorts.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong> — {c.facilitator} · {c.time} ({c.members}/{c.maxMembers})
          </li>
        ))}
      </ul>
    </div>
  );
}
