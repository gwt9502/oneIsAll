import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, Image, TouchableWithoutFeedback, Modal, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { screen } from '../util';
import { inject, observer } from 'mobx-react';

@inject('home', 'common')

@observer
class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      visible: false,
      fade: new Animated.Value(1),
      translateValue: new Animated.ValueXY({ x: 0, y: screen.height })
    }
  }

  componentDidMount () {
    this.init()
  }

  init = async () => {
    await this.props.common.toggleLoading()
    await this.props.home.getDateLists()
    await this.props.home.getChannel()
    await this.props.common.toggleLoading()
  }

  goBookDetail = (item, title) => {
    this.props.navigation.navigate('BookDetail', {item_id: item.item_id, title: title, type:item.content_type })
  }

  renderItem = ({ item, index }) => {
    const contentTypes = ['ONE STORY', '连载', '问答', '音乐', '影视']
    return item.display_category == 4 ? (
      <View style={[styles.item, {marginTop: 0}]}>
        <View style={styles.img}>
          <Image source={{uri: item.img_url}} style={{width: screen.width, height: 200}} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.titleAndPic}>{item.title}</Text>
          <Text style={styles.titleAndPic}>{item.pic_info}</Text>
        </View>
        <View>
          <Text style={styles.forward4}>{item.forward}</Text>
        </View>
        <View>
          <Text style={styles.titleAndPic}>{item.words_info}</Text>
        </View>
        <View style={styles.itemFooter}>
          <View style={{flexDirection: 'row', alignContent: 'center'}}>
            <Icon name="md-compass" size={15} color="#666" style={{marginRight: 5}} />
            <Text style={{fontSize: 13.5}}>{this.props.home.isToday ? `今天` : item.post_date.substr(0, 10)}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="md-create" size={18} color="#666" style={{marginRight: 25}} />
            <Icon name="ios-bookmark-outline" size={18} color="#666" style={{marginRight: 25}} />
            <Icon name="ios-heart-outline" size={18} color="#666" style={{marginRight: 25}} />
            <Icon name="md-share" size={15} color="#666" />
          </View>
        </View>
      </View>
    ) : (
      <TouchableWithoutFeedback onPress={() => this.goBookDetail(item, contentTypes[item.content_type - 1])}>
        <View style={[styles.novelItme]}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <Text style={styles.textColor}>一</Text>
            <Text style={[styles.textColor, {marginLeft: 5, marginRight: 5}]}>
              {
                item.tag_list.length > 0 ? item.tag_list[0].title : contentTypes[item.content_type - 1]
              }
            </Text>
            <Text style={styles.textColor}>一</Text>
          </View>
          <View>
            <Text style={{color: '#222', width: screen.width - 40, fontSize: 18, marginTop: 15, marginBottom: 15, lineHeight: 22}}>{item.title}</Text>
          </View>
          <View>
            <Text style={{width: screen.width - 40, color: '#666', marginBottom: 10}}>文 / {item.author.user_name}</Text>
          </View>
          <View style={styles.img}>
            <Image source={{uri: item.img_url}} style={{width: screen.width - 40, height: 200}} />
          </View>
          <View>
            <Text style={[styles.forward4, {width: screen.width - 40, color: '#666'}]}>{item.forward}</Text>
          </View>
          <View style={styles.itemFooter}>
            <View>
              <Text>{this.props.home.isToday ? `今天` : item.post_date.substr(0, 10)}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="ios-heart-outline" size={18} color="#666" style={{marginRight: 15}} />
              <Icon name="md-share" size={15} color="#666" />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  toggleVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
    Animated.timing(this.state.translateValue, {
      toValue: !this.state.visible ? 0 : screen.height,
      useNativeDriver: true
    }).start()
    Animated.timing(this.state.fade, {
      toValue: !this.state.visible ? 0 : 1,
      useNativeDriver: true
    }).start()
    
  }

  render() {
    return (
      <View style={styles.home}>
        <View style={styles.homeHeader}>
          <View style={styles.showMonthModel}>
            <TouchableOpacity onPress={() => this.toggleVisible()}>
              <View><Text style={{fontWeight: '700', fontSize: 18}}>{this.props.home.currentDate}</Text></View>
            </TouchableOpacity>
          </View>
          {
            this.props.home.isToday ? (
              <Animated.View style={[styles.todayWeather, { opacity: this.state.fade }]}>
                <Text style={[styles.cityName, styles.textColor]}>{this.props.home.weather.city_name}</Text>
                <View style={styles.circle}></View>
                <Text style={[styles.climate, styles.textColor]}>{this.props.home.weather.climate}</Text>
                <Text style={styles.textColor}>{this.props.home.weather.temperature}°C</Text>
              </Animated.View>
            ) : (
              <TouchableOpacity>
                <Text>今天</Text>
              </TouchableOpacity>
            )
          }
        </View>
        <FlatList
          data={this.props.home.homeDataLists}
          onRefresh={this.init}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderItem}
          showsVerticalScrollIndicator={false} // 隐藏滚动条
          refreshing={this.props.common.loading}
        />
        {/* 时间选择 */}
        <Animated.View style={[styles.content, {
              transform: [
                {translateY: this.state.translateValue.y},
              ]}
            ]}>
            <Text>nihaozaijian</Text>
            <Text>nihaozaijian</Text>
            <Text>nihaozaijian</Text>
            <Text>nihaozaijian</Text>
            <Text>nihaozaijian</Text>
            <Text>nihaozaijian</Text>
            <Text>nihaozaijian</Text>
        </Animated.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  home: {
    paddingBottom: 64,
    // backgroundColor: '#fff'
  },
  homeHeader: {
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
  todayWeather: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColor: {
    color: '#666',
    fontSize: 13
  },
  circle: {
    width: 3,
    height: 3,
    borderRadius: 3,
    backgroundColor: '#666',
    marginLeft: 3,
  },
  climate: {
    marginLeft: 3,
    marginRight: 3,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  titleAndPic: {
    flexDirection: 'row',
    marginTop: 5,
    color: '#666',
    fontSize: 12
  },
  forward4: {
    marginTop: 10,
    marginBottom: 10,
    lineHeight: 22,
    width: screen.width - 70,
  },
  itemFooter: {
    marginTop: 10,
    width: screen.width - 40,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  novelItme: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#fff'
  },
  content: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    flex: 3,
  }
});

export default Home;
