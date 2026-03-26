import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
export const MockServiceCredits = () => (<View style={styles.container}><Text style={styles.title}>Service Credits (mock)</Text><Button title="Use credits (mock)" onPress={()=>{}}/></View>);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700'}});
