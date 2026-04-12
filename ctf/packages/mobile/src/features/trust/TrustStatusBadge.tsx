import React from 'react';
import { Text, StyleSheet } from 'react-native';

export interface TrustStatusBadgeProps {
  trustStatus: 'verified' | 'unverified' | 'flagged';
}

export const TrustStatusBadge: React.FC<TrustStatusBadgeProps> = ({ trustStatus }) => {
  let color = '#888', bg = '#222';
  if (trustStatus === 'verified') { color = '#166534'; bg = '#bbf7d0'; }
  else if (trustStatus === 'flagged') { color = '#991b1b'; bg = '#fecaca'; }
  return (
    <Text style={[styles.badge, { backgroundColor: bg, color }]}>{trustStatus.charAt(0).toUpperCase() + trustStatus.slice(1)}</Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    fontWeight: '600',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
    overflow: 'hidden',
  },
});
