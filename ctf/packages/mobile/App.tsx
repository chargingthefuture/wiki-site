
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { ChymeRoom } from './src/features/chyme';


export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChargingTheFuture</Text>
      <Text style={styles.subtitle}>Mobile App</Text>
      <ChymeRoom />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
