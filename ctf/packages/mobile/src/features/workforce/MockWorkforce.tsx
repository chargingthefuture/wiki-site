import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export const MockWorkforce = () => (
  <View style={styles.container}><Text style={styles.title}>Workforce (mock)</Text><Button title="Open Recruiter (mock)" onPress={()=>{}} /></View>
);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700',marginBottom:12}});
