import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const announcements = [ {id:'a1', title:'Welcome', body:'Hello (mock)'} ];

export const MockAnnouncements = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Announcements (mock)</Text>
    <FlatList data={announcements} keyExtractor={a=>a.id} renderItem={({item}) => (
      <View style={styles.row}><Text style={{fontWeight:'600'}}>{item.title}</Text><Text>{item.body}</Text></View>
    )} />
  </View>
);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700',marginBottom:12},row:{padding:8,borderBottomWidth:1,borderColor:'#eee'}});
