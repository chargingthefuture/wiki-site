import React from 'react';
import { TrustEvidencePanel, TrustUserExtension } from './TrustEvidencePanel';

// TODO: Replace with real data fetching from API
const mockTrust: TrustUserExtension = {
  trustStatus: 'unverified',
  trustVisibility: 'public',
  trustEvidence: [],
};

export const Trust: React.FC<{ trust?: TrustUserExtension; compact?: boolean }> = ({ trust = mockTrust, compact }) => {
  return <TrustEvidencePanel trust={trust} compact={compact} />;
};
