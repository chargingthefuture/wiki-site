import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const mockAnnouncements = [
  { id: 'a1', title: 'Welcome', body: 'Welcome to the directory (mock)' },
  { id: 'a2', title: 'Maintenance', body: 'Scheduled maintenance (mock)' },
];

export const AnnouncementList = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements (mock)</Text>
      <FlatList
        data={mockAnnouncements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.annTitle}>{item.title}</Text>
            <Text style={styles.annBody}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  row: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  annTitle: { fontWeight: '600' },
  annBody: { color: '#444', marginTop: 4 },
});
