import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const skills = [{id:'s1', name:'React'}, {id:'s2', name:'Design'}];
export const MockSkillsHunt = () => (
  <View style={styles.container}><Text style={styles.title}>Skills Hunt (mock)</Text><FlatList data={skills} keyExtractor={s=>s.id} renderItem={({item})=>(<Text>{item.name}</Text>)} /></View>
);
const styles = StyleSheet.create({container:{flex:1,padding:12},title:{fontSize:18,fontWeight:'700',marginBottom:12}});
