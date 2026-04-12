
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { fetchProviders, createConnectionThread } from './api';

export const Foundation = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  const loadProviders = () => {
    setLoading(true);
    setError(null);
    fetchProviders(query, page)
      .then((data) => setProviders(data.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  const handleConnect = async (provider) => {
    setConnecting(true);
    setConnectionStatus(null);
    try {
      const data = await createConnectionThread(provider.profileId);
      if (data.ok) {
        setConnectionStatus('Connection thread created!');
      } else {
        setConnectionStatus(data.message || 'Failed to create connection');
      }
    } catch (e) {
      setConnectionStatus(e.message || 'Error connecting');
    } finally {
      setConnecting(false);
    }
  };

  if (selected) {
    return (
      <View style={styles.container}>
        <Button title="Back to list" onPress={() => setSelected(null)} />
        <Text style={styles.title}>{selected.displayName}</Text>
        <Text>{selected.headline}</Text>
        <Text>{selected.bio}</Text>
        <Button title={connecting ? 'Connecting...' : 'Connect'} onPress={() => handleConnect(selected)} disabled={connecting} />
        {connectionStatus && <Text style={{ marginTop: 12 }}>{connectionStatus}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find Providers</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search providers..."
        style={styles.input}
      />
      {loading && <ActivityIndicator style={{ marginVertical: 12 }} />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <FlatList
        data={providers}
        keyExtractor={item => item.profileId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelected(item)} style={styles.item}>
            <Text style={styles.name}>{item.displayName}</Text>
            <Text style={styles.headline}>{item.headline}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading && <Text>No providers found.</Text>}
      />
      <View style={styles.pagination}>
        <Button title="Prev" onPress={() => setPage(page - 1)} disabled={page === 1} />
        <Text style={{ marginHorizontal: 12 }}>Page {page}</Text>
        <Button title="Next" onPress={() => setPage(page + 1)} disabled={providers.length === 0} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 16 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontWeight: '700', fontSize: 16 },
  headline: { color: '#666', fontSize: 14 },
  pagination: { flexDirection: 'row', alignItems: 'center', marginTop: 16, justifyContent: 'center' },
});
