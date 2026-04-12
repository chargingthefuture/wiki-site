import { describe, it, expect } from 'vitest';
import { extractAnonymizedTransactions, extractAnonymizedRegionalFlows, extractAnonymizedInputOutput } from './etl';
import { computeNetworkInterdependence } from './module-network';
import { computeGeopoliticalInterdependence } from './module-geopolitical';
import { computeInputOutputInterdependence } from './module-inputoutput';

describe('ETL Pipeline', () => {
  it('anonymizes and buckets transaction records', () => {
    const raw = [{ user_id: 'u1', counterparty_id: 'u2', amount: 5, community_id: 'c1', timestamp: '2026-03-31T12:00:00Z' }];
    const result = extractAnonymizedTransactions(raw);
    expect(result[0].source_id).toMatch(/^anon_/);
    expect(result[0].timestamp).toBe('2026-03-31');
  });
});

describe('Modules', () => {
  it('returns empty state for network interdependence with no data', () => {
    const result = computeNetworkInterdependence([]);
    expect(result.emptyState).toBe(true);
    expect(result.global).toBeNull();
    expect(result.explanation).toMatch(/no data/i);
  });

  it('returns empty state for geopolitical interdependence with no data', () => {
    const result = computeGeopoliticalInterdependence([]);
    expect(result.emptyState).toBe(true);
    expect(result.global).toBeNull();
    expect(result.explanation).toMatch(/no data/i);
  });

  it('returns empty state for input-output interdependence with no data', () => {
    const result = computeInputOutputInterdependence([]);
    expect(result.emptyState).toBe(true);
    expect(result.global).toBeNull();
    expect(result.explanation).toMatch(/no data/i);
  });
});
