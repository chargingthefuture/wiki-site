// API client for Skills Taxonomy plugin (mobile)
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  web: '/api/skills-taxonomy',
  default: 'https://your-api-domain.com/api/skills-taxonomy', // TODO: Replace with actual prod URL or env
});

async function fetchJson(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const SkillsTaxonomyApi = {
  async getHierarchy() {
    return fetchJson('/hierarchy');
  },
  async getFlattened() {
    return fetchJson('/flattened');
  },
  async createSector(data) {
    return fetchJson('/admin/sectors', { method: 'POST', body: JSON.stringify(data) });
  },
  async updateSector(id, data) {
    return fetchJson(`/admin/sectors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },
  async deleteSector(id, reason) {
    return fetchJson(`/admin/sectors/${id}`, { method: 'DELETE', body: JSON.stringify({ reason }) });
  },
  // Add job title/skill CRUD as needed
};
