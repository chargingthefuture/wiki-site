import { NextApiRequest, NextApiResponse } from 'next';

import { getCohorts } from '../../../../lib/peer-programming/repository';
import { requirePeerProgrammingAuth } from '../../../../lib/peer-programming/auth';

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  // Example: extract provider/token from headers or cookies
  const provider = req.headers['x-auth-provider'] as string || 'clerk';
  const token = req.headers['authorization']?.replace('Bearer ', '') || undefined;
  const authResult = await requirePeerProgrammingAuth({ provider, token });
  if (!authResult.isAuthenticated) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  try {
    const cohorts = await getCohorts();
    res.status(200).json(cohorts);
  } catch (e) {
    res.status(500).json({ error: 'Failed to load cohorts' });
  }
}
