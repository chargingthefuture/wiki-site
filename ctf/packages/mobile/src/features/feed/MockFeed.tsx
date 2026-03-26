import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const items = [
  { id: 'f1', title: 'Feed item 1' },
  { id: 'f2', title: 'Feed item 2' },
];

export const MockFeed = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Feed (mock)</Text>
    <FlatList data={items} keyExtractor={i=>i.id} renderItem={({item}) => (
      <View style={styles.row}><Text>{item.title}</Text></View>
    )} />
  </View>
);

const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700',marginBottom:12},row:{padding:8,borderBottomWidth:1,borderColor:'#eee'}});
