import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
export const MockSocketRelay = () => (<View style={styles.container}><Text style={styles.title}>SocketRelay (mock)</Text></View>);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700'}});
