import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const MockGdp = () => (<View style={styles.container}><Text style={styles.title}>GDP (mock)</Text></View>);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700'}});
