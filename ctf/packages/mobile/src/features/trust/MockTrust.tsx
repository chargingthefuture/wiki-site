import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MockTrust = () => (
  <View style={styles.container}><Text style={styles.title}>Trust (mock)</Text><Text>Trust UI placeholders</Text></View>
);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700',marginBottom:12}});
