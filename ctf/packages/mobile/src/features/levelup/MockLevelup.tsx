import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const EmptyState = () => (
	<View style={styles.emptyContainer}>
		<Text style={styles.emptyText}>No cohorts available. Check back soon!</Text>
	</View>
);

export const MockLevelup = () => (
	<View style={styles.container}>
		<Text style={styles.title}>LevelUp (mock)</Text>
		<Button title="Open Level (mock)" onPress={() => {}} />
		<EmptyState />
	</View>
);

const styles = StyleSheet.create({
	container: { flex: 1, padding: 12 },
	title: { fontSize: 18, fontWeight: '700' },
	emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
	emptyText: { color: '#94A3B8', fontSize: 16 },
});
