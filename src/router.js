import React, { Component } from 'react';
import { View, Text,  } from 'react-native';
import { TabNavigator, StackNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './pages/home';
import All from './pages/all';
import BookDetail from './pages/bookDetail';
import KindDetail from './pages/kindDetail';
import Search from './pages/search';

const Tab = TabNavigator({
  ONE: {
    screen: Home,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: '首页',
      tabBarIcon: ({ focused, tintColor }) => (
        <Icon name="ios-home" size={25} color={tintColor} />
      )
    })
  },
  ALL: {
    screen: All,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: '全部',
      tabBarIcon: ({ focused, tintColor }) => (
        <Icon name="ios-apps" size={25} color={tintColor} />
      )
    })
  }
}, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  lazy: true,
  tabBarOptions: {
    activeTintColor: '#108ee9',
    inactiveTintColor: '#888',
    labelStyle: {
      fontSize: 12
    },
    style: {
        backgroundColor: '#fff'
    }
  }
})

const RouterScreen = StackNavigator({
  Tab: { screen: Tab },
  BookDetail: { screen: BookDetail },
  Search: { screen: Search },
  KindDetail: { screen: KindDetail }
}, {
  navigationOptions: {
    header: null
  }
})

export default RouterScreen;
