import React, { Component } from 'react';
import { View, Text, WebView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, FlatList, Image, ScrollView, Platform, Animated } from 'react-native';
import { observer, inject } from 'mobx-react';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { screen } from '../util';

@inject('bookDetail', 'common')

@observer
class BookDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: new Map(),
      directionIsUp: true,
      contentOffsetY: 0,
      scrollTopAndIsZero: true, // 向上滚动，如果没有到顶部，背景设置为白色，到顶部，背景透明
      fadeInView: new Animated.Value(1)
    }
  }

  async componentDidMount () {
    await this.props.bookDetail.init()
    const { item_id, type } = this.props.navigation.state.params
    await this.props.bookDetail.getHtmlContent(item_id, type)
    await this.getCommentLists()
  }

  // 滚动加载的时候阻止多次render, 点击展开的时候render
  shouldComponentUpdate (nextProps, nextState) {
    const { type } = this.props.navigation.state.params
    if (nextProps.bookDetail.bookDetail.id != this.props.bookDetail.bookDetail.id) {
      return true
    }
    if (nextState.selected != this.state.selected) {
      return true
    }
    if (type == 4 || type == 5) {
      if (nextState != this.state) {
        return true
      }
    }
    return false
  }

  getCommentLists = async () => {
    if (!this.props.bookDetail.isEmptyLoading && !this.props.common.loading) {
      const { item_id, type } = this.props.navigation.state.params
      await this.props.common.toggleLoading()
      await this.props.bookDetail.getCommentLists(item_id, type)
      await this.props.common.toggleLoading()
    }
  }

  postWebView = (e) => {
    const contentTypes = ['ONE STORY', '连载', '问答', '音乐', '影视']
    const item = JSON.parse(e.nativeEvent.data)
    this.props.navigation.push('BookDetail', {item_id: item.item_id, title: contentTypes[item.content_type - 1], type:item.content_type })
  }

  listHeader = () => {
    const { type } = this.props.navigation.state.params
    return <AutoHeightWebView
      type={type == 4 || type == 5 || type == 9}
      scrollEnabled={false}
      hasIframe={true}
      scalesPageToFit={Platform.OS === 'android' ? true : false}
      enableBaseUrl={true}
      style={{ width: screen.width }}
      enableAnimation={true}
      animationDuration={255}
      onMessage={this.postWebView}
      source={{html: this.props.bookDetail.bookDetail.html_content}}
    />
  }

  itemToggle = (item) => {
    this.setState((state) => {
      const selected = new Map(state.selected);
      selected.set(item.id, !selected.get(item.id)); 
      return {selected};
    })
  }
    
  renderCommentItem = ({ item, index }) => (
    <CommentItem item={item} onPressItem={this.itemToggle} showToggle={!!this.state.selected.get(item.id)} type={this.props.navigation.state.params.type} bg_color={this.props.bookDetail.bookDetail.bg_color} font_color={this.props.bookDetail.bookDetail.font_color}/>
  )

  renderBorder = () => (
    this.props.navigation.state.params.type == 9 ? null : <View style={{borderBottomColor: '#e2e2e2', borderBottomWidth: 1}}></View>
  )

  onScroll = async (e) => {
    const { y } = e.nativeEvent.contentOffset
    if (y <= 250) {
      await this.setState({ directionIsUp: true,scrollTopAndIsZero: true })
    } else {
      await this.setState({directionIsUp: y < this.state.contentOffsetY || y < 250, contentOffsetY: y, scrollTopAndIsZero: false})
    }
    Animated.timing(
      this.state.fadeInView,
      {
        toValue: y > 250 ? 1 : 0,
        duration: 300
      },
    ).start();
  }

  render() {
    const { type } = this.props.navigation.state.params
    const headerNoBg = type == 4 || type == 5 || type == 9
    return (
      <View style={{flex: 1, backgroundColor: this.props.bookDetail.bookDetail.bg_color || '#fff'}}>
        <Animated.View style={[styles.detailHeader, headerNoBg ? styles.typeHeader : null, this.state.fadeInView &&{backgroundColor: this.state.scrollTopAndIsZero ? 'rgba(255,255,255,0)' : '#fff'}]}>
          <TouchableOpacity onPress={() => this.props.navigation.pop()}>
            <Icon name="ios-arrow-back-outline" size={25} style={{paddingRight: 0, color: type == 9 ? '#fff': null}} />
          </TouchableOpacity>
          <Text style={{paddingLeft: 0}}>{this.props.navigation.state.params.title}</Text>
          {
            type == 9 ? (<Text></Text>) : (<Icon name="ios-bookmark-outline" size={25} />)
          }
        </Animated.View>
        <FlatList
            style={{backgroundColor: this.props.bookDetail.bookDetail.bg_color || '#fff', marginTop: headerNoBg ? 0 : 64}}
            data={this.props.bookDetail.commentLists}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={this.listHeader}
            ItemSeparatorComponent={this.renderBorder}
            renderItem={this.renderCommentItem}
            refreshing={this.props.common.loading}
            onEndReachedThreshold={0.1}
            // initialNumToRender={5}
            onEndReached={this.getCommentLists}
            onScroll={(type == 4 || type == 5) && this.onScroll}
            ListFooterComponent={() => !this.props.bookDetail.isEmptyLoading ? <Text style={{textAlign: 'center', padding: 10, transform: [{scale: 0.857143}]}}>{this.props.common.loading ? `正在努力加载数据....` : null}</Text> : <Text style={{textAlign: 'center', padding: 10, transform: [{scale: 0.857143}]}}>已经全部加载完毕</Text>}
          />
      </View>
    );
  }
}

class CommentItem extends Component {
  render () {
    const { item, onPressItem, showToggle, type, bg_color, font_color } = this.props
    return (
      <View style={styles.commentItem} key={item.id}>
        {/* 头部 */}
        <View style={styles.itemHeader}>
          <View style={styles.itemLeft}>
            <Image source={{uri: item.user.web_url}} style={{width: 20, height: 20, borderRadius: 10, marginRight: 8}} />
            <Text style={[styles.defaultText, {color: font_color}]}>{item.user.user_name}</Text>
          </View>
          <View>
            <Text style={[styles.defaultText, {color: font_color}]}>{item.created_at.substr(0, 16)}</Text>
          </View>
        </View>
        {/* 评论内容 */}
        <View>
          {
            item.quote && (
              <View style={{borderColor: type == 9 ? font_color : '#e2e2e2', borderWidth: 1, margin: 10, marginBottom: 0, paddingLeft: 6}}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={[styles.content, {color: font_color}]}>{item.touser.user_name + ': ' +item.quote}</Text>
              </View>
            )
          }
          <Text style={[styles.content, {color: font_color}]} numberOfLines={!showToggle ? 5 : 0} ellipsizeMode="tail">{item.content.replace(/\n/g, '')}</Text>
        </View>
        {/* 底部 */}
        <View style={styles.itemFooter}>
          <View>
            {
              item.content.length > 110 && (
                <TouchableOpacity onPress={() => onPressItem(item)}>
                  <Text style={[styles.defaultText, {color: type == 9 ? font_color : '#108ee9'}]}>{!showToggle ? `展开` : `收起`}</Text>
                </TouchableOpacity>
              )
            }
          </View>
          <View style={styles.itemFooterRight}>
            <View style={[styles.itemReply, {marginRight: 25}]}>
              <Icon name="ios-text-outline" size={23} color={type == 9 ? font_color : '#666'} />
            </View>
            <View style={styles.itemPraise}>
              <Icon name="ios-thumbs-up-outline" size={20} color={type == 9 ? font_color : '#666'} style={{marginRight: 5}} />
              {
                item.praisenum > 0 ? (
                  <Text style={styles.defaultText}>{item.praisenum}</Text>
                ) : null
              }
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  detailHeader: {
    height: 64,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screen.width,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
    position: 'absolute'
  },
  typeHeader: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0)',
    borderBottomWidth: 0
  },
  defaultText: {
    color: '#666'
  },
  commentItem: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  content: {
    paddingLeft: 4,
    paddingRight: 4,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 10
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  itemFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemPraise: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default BookDetail;
