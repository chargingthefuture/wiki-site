import { Platform } from 'react-native';

const API_BASE = Platform.OS === 'web' ? '/api/foundation' : 'https://your-api-domain/api/foundation';

export async function fetchProviders(query = '', page = 1) {
  const res = await fetch(`${API_BASE}/providers/search?q=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch providers');
  return res.json();
}

export async function createConnectionThread(profileId: string) {
  const res = await fetch(`${API_BASE}/connections/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ providerId: profileId }),
  });
  return res.json();
}
