import React, { Component } from 'react';
import {  View, Text, Platform, FlatList, ScrollView, StyleSheet } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { inject, observer } from 'mobx-react';
import { screen } from '../util';

@inject('kindDetail')

@observer
export default class KindDetail extends Component {

  componentDidMount () {
    this.props.kindDetail.getKindDetail(this.props.navigation.state.params.type)
  }

  postWebView = (e) => {
    const contentTypes = ['ONE STORY', '连载', '问答', '音乐', '影视']
    const item = JSON.parse(e.nativeEvent.data)
    this.props.navigation.push('BookDetail', {item_id: item.id, title: contentTypes[this.props.navigation.state.params.type - 1], type:this.props.navigation.state.params.type })
  }

  render() {
    return (
      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.allHeader}>
          <Text style={{}}>{this.props.navigation.state.params.name}</Text>
        </View>
        <ScrollView>
          <AutoHeightWebView
            scrollEnabled={true}
            hasIframe={true}
            onMessage={this.postWebView}
            scalesPageToFit={Platform.OS === 'android' ? true : false}
            source={{html: this.props.kindDetail.detail.html_content}}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  allHeader: {
    height: 64,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    width: screen.width,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
});
