import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MockFoundation = () => (
  <View style={styles.container}><Text style={styles.title}>Foundation (mock)</Text><Text>Core foundation features (mock)</Text></View>
);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700',marginBottom:12}});
