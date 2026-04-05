import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, TextInput, StyleSheet, Alert } from 'react-native';
import { getChymeMessages, postChymeMessage, postChymeJoin, deleteChymeProfile, deleteFullAccount } from './ChymeApi';

export const ChymeRoom = () => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await getChymeMessages();
        // res may be { messages: [...] } or an array depending on backend
        const msgs = Array.isArray(res) ? res : res?.messages ?? [];
        if (mounted) setMessages(msgs.reverse());
      } catch (err) {
        console.warn('Failed to load messages', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const sent = await postChymeMessage(undefined, text.trim());
      // sent may be the message object
      setMessages(prev => [sent, ...prev]);
      setText('');
    } catch (err) {
      Alert.alert('Send failed', String(err));
    }
  };

  const handleJoin = async () => {
    try {
      const res = await postChymeJoin();
      if (res?.success) {
        setJoined(true);
        Alert.alert('Joined', 'You joined the room (mock)');
      }
    } catch (err) {
      Alert.alert('Join failed', String(err));
    }
  };

  const handleDeleteProfile = async () => {
    try {
      await deleteChymeProfile();
      Alert.alert('Deleted', 'Chyme profile deleted (mock)');
    } catch (err) {
      Alert.alert('Delete failed', String(err));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteFullAccount();
      Alert.alert('Deleted', 'Full account deleted (mock)');
    } catch (err) {
      Alert.alert('Delete failed', String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chyme</Text>
      <Text style={styles.subtitle}>Social audio for survivors</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No messages yet</Text>
          <Text style={styles.emptyStateText}>
            Start the conversation by sharing your thoughts. This is a safe space for survivors.
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.messageRow}>
              <Text style={styles.messageAuthor}>{item.sender ?? 'You'}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.controls}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Share your thoughts"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
        <Button title="Send" onPress={handleSend} disabled={!text.trim()} />
      </View>

      <View style={styles.rowButtons}>
        <Button title={joined ? 'Joined' : 'Join Room'} onPress={handleJoin} disabled={joined} />
        <Button title="Delete Chyme Profile" onPress={handleDeleteProfile} />
        <Button title="Delete Full Account" onPress={handleDeleteAccount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingTop: 16, backgroundColor: '#021006' },
  title: { fontWeight: 'bold', fontSize: 20, marginBottom: 4, color: '#F0FDF4' },
  subtitle: { fontSize: 14, color: '#16A34A', marginBottom: 16 },
  list: { width: '95%', maxHeight: 300, marginBottom: 8 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  emptyStateTitle: { fontSize: 18, fontWeight: '700', color: '#F0FDF4', marginBottom: 12, textAlign: 'center' },
  emptyStateText: { fontSize: 15, color: '#4B5563', textAlign: 'center', lineHeight: 1.6 },
  messageRow: { padding: 8, borderBottomWidth: 1, borderColor: '#052e16' },
  messageAuthor: { fontWeight: '600', color: '#22C55E' },
  messageText: { marginTop: 4, color: '#E8EAF0' },
  controls: { flexDirection: 'row', width: '95%', alignItems: 'center', marginBottom: 8, paddingHorizontal: 12 },
  input: { flex: 1, borderColor: '#052e16', borderWidth: 1, padding: 8, marginRight: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)', color: '#E8EAF0' },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '95%', paddingHorizontal: 12 },
});
