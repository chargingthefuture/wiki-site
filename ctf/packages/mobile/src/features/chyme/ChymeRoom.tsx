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
      <Text style={styles.title}>Chyme Room</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          inverted
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.messageRow}>
              <Text style={styles.messageAuthor}>{item.sender ?? 'unknown'}</Text>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
        />
      )}

      <View style={styles.controls}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} />
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%', paddingTop: 16 },
  title: { fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  list: { width: '95%', maxHeight: 300, marginBottom: 8 },
  messageRow: { padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  messageAuthor: { fontWeight: '600' },
  messageText: { marginTop: 4 },
  controls: { flexDirection: 'row', width: '95%', alignItems: 'center', marginBottom: 8 },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, padding: 8, marginRight: 8, borderRadius: 4 },
  rowButtons: { flexDirection: 'row', justifyContent: 'space-around', width: '95%' },
});
