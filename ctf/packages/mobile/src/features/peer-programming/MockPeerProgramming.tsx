import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export const MockPeerProgramming = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Peer Programming (mock)</Text>
    <Button title="Start Session (mock)" onPress={()=>{}} />
  </View>
);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700',marginBottom:12}});
