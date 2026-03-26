import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
export const MockLevelup = () => (<View style={styles.container}><Text style={styles.title}>LevelUp (mock)</Text><Button title="Open Level (mock)" onPress={()=>{}}/></View>);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700'}});
