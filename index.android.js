import React, { Component } from 'react';
import { LoginPage } from './android_components/loginPage.js';
import { Prova } from './android_components/prova.js';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableHighlight,
  Navigator
} from 'react-native';

export default class TicTacToeExtreme extends Component {
  render() {
    return (
      <Navigator style={{flex : 1}}
        initialRoute={{name : "LoginPage", component : LoginPage, index : 0}}
        renderScene={this.renderScene}
        configureScene={this.configureScene} />
    );
  }

  renderScene(route, navigator) {
    if(route.name == "LoginPage")
      return <LoginPage navigator={navigator} />;
    else if (route.name == "Prova")
      return <Prova navigator={navigator} />;
  }

  configureScene(route, routeStack){
   return Navigator.SceneConfigs.HorizontalSwipeJump;
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('TicTacToeExtreme', () => TicTacToeExtreme);
//AppRegistry.registerComponent('LoginForm', () => LoginForm);
