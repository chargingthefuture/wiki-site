import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
export const MockUnlock = () => (<View style={styles.container}><Text style={styles.title}>Unlock (mock)</Text><Button title="Request Unlock (mock)" onPress={()=>{}}/></View>);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700'}});
