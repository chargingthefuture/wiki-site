import React from 'react';
import { View, Text, Button } from 'react-native';

// Placeholder for Chyme Room UI
export const ChymeRoom = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Chyme Room (Android Parity Placeholder)</Text>
      {/* TODO: Implement room join, participant list, chat panel, and deletion actions */}
      <Button title="Join Room" onPress={() => {}} />
      <Button title="Open Chat" onPress={() => {}} />
      <Button title="Delete Chyme Profile" onPress={() => {}} />
    </View>
  );
};
