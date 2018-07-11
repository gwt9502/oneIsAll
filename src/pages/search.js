import React, { Component } from 'react';
import {  View, Text, StyleSheet, TextInput, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { screen } from '../util';

export default class Search extends Component {

  goKindDetail = (item) => {
    console.log(item)
    this.props.navigation.push('KindDetail', { type: item.val, name: item.name })
  }

  render() {
    const typeKinds = [
      { name: '图文', val: 0 },
      { name: '问答', val: 3 },
      { name: '阅读', val: 1 },
      { name: '连载', val: 2 },
      { name: '影视', val: 5 },
      { name: '音乐', val: 4 },
      { name: '电台', val: 8 }
    ]
    return (
      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.searchHeader}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center', backgroundColor: '#e2e2e2', borderRadius: 6, padding: 5, marginRight: 5}}>
            <Icon name="ios-search-outline" size={14} style={{marginRight: 5}} />
            <TextInput placeholder="在这里写下你想寻找的" style={{flex: 1}} />
          </View>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack()}>
            <View><Text>取消</Text></View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.content}>
          {
            typeKinds.map((item, index) => (
              <TouchableWithoutFeedback key={index} onPress={() => this.goKindDetail(item)}>
                <View><Text style={{color: '#666', fontSize: 16}}>{item.name}</Text></View>
              </TouchableWithoutFeedback>
            ))
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchHeader: {
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    width: screen.width,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  content: {
    height: screen.height - 64,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
    paddingBottom: 200
  }
});
