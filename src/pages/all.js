import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TouchableWithoutFeedback, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import { screen } from '../util';
import { Carousel } from 'antd-mobile';
import { inject, observer } from 'mobx-react';
import Swiper from 'react-native-swiper';


@inject('common', 'all')

@observer
class All extends Component {
  constructor(props){
    super(props)
  }

  async componentDidMount () {
    await this.props.all.initAllData()
    await this.props.all.getBannerLists()
    await this.getSpecialLists()
  }

  getSpecialLists = () => {
    if (!this.props.all.isEnd && !this.props.common.loading)
    this.props.all.getSpecialLists()
  }

  listHeader = ({item, index}) => (
    <View style={styles.listHeader}>
      <Carousel
        height={200}
        autoplay
        selectedIndex={2}
        infinite={true}
        dotStyle={{backgroundColor: 'rgba(255,255,255,0)', borderColor: '#fff', width: 8, height: 8, borderRadius: 4, margin: 3, borderWidth: 1}}
        dotActiveStyle={{backgroundColor: 'rgba(255,255,255,1)', width: 8, height: 8, borderRadius: 4, margin: 3, borderWidth: 0}}
      >
        {
          this.props.all.bannerLists.map((item, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => this.goDetail(item)}>
              <Image source={{uri: item.cover}} style={{width: screen.width, height: 200}} />
            </TouchableWithoutFeedback>

          ))
        }
      </Carousel>

    </View>
  )

  goDetail = (item) => {
    this.props.navigation.push('BookDetail', {item_id: item.content_id, title: '专题', type:9 })
  }

  renderItem = ({ item, index }) => (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <TouchableWithoutFeedback onPress={() => this.goDetail(item)}>
        <View>
          <ImageBackground source={{uri: item.cover}} style={{width: screen.width - 40, height: 200, marginTop: 15, overflow: 'hidden'}}>
            <View style={styles.title}>
              <Text style={{fontSize: 12, color: '#fff', marginBottom: 7}}>专题</Text>
            </View>
          </ImageBackground>
          <Text style={{width: screen.width - 40, fontSize: 16, color: 'rgba(0,0,0,.8)', marginBottom: 25, marginTop: 15, lineHeight: 22}}>{item.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )

  renderItemBorder = () => (
    <View style={{height: 10, backgroundColor: '#E9E9EF'}}></View>
  )

  render() {
    return (
      <View style={{backgroundColor: '#fff'}}>
        <View style={styles.allHeader}>
          <Text></Text>
          <Text style={{fontWeight: '700', fontSize: 18}}>ONE &nbsp;&nbsp;IS  &nbsp;&nbsp;ALL</Text>
          <TouchableOpacity onPress={() => this.props.navigation.push('Search')}>
            <Icon name="ios-search-outline" size={20} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.props.all.specialLists}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={this.listHeader}
          renderItem={this.renderItem}
          refreshing={this.props.common.loading}
          onEndReached={this.getSpecialLists}
          removeClippedSubviews={false}
          ItemSeparatorComponent={this.renderItemBorder}
          style={{marginBottom: 64}}
          onEndReachedThreshold={0.1}
          initialNumToRender={5}
          ListFooterComponent={() => !this.props.all.isEnd ? <Text style={{textAlign: 'center', padding: 10, transform: [{scale: 0.857143}]}}>{this.props.common.loading ? `正在努力加载数据....` : null}</Text> : <Text style={{textAlign: 'center', padding: 10, transform: [{scale: 0.857143}]}}>已经全部加载完毕</Text>}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    position: 'absolute',
    width: 70,
    height: 70,
    backgroundColor: 'rgba(0,0,0,.2)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    top: -35,
    left: -35,
    transform: [{rotate: '-45deg'}]
  }
});

export default All;
