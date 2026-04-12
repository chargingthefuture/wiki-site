import React from 'react';
import { Text, StyleSheet } from 'react-native';

export interface TrustVisibilityBadgeProps {
  trustVisibility: 'public' | 'private' | 'restricted';
}

export const TrustVisibilityBadge: React.FC<TrustVisibilityBadgeProps> = ({ trustVisibility }) => {
  let color = '#888', bg = '#222';
  if (trustVisibility === 'public') { color = '#1e40af'; bg = '#dbeafe'; }
  else if (trustVisibility === 'private') { color = '#92400e'; bg = '#fef3c7'; }
  else if (trustVisibility === 'restricted') { color = '#6d28d9'; bg = '#ede9fe'; }
  return (
    <Text style={[styles.badge, { backgroundColor: bg, color }]}>{trustVisibility.charAt(0).toUpperCase() + trustVisibility.slice(1)}</Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    fontSize: 12,
    fontWeight: '600',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    overflow: 'hidden',
  },
});
