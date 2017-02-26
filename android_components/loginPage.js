import React, { Component } from 'react';
import {Prova} from './prova.js';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  Navigator
} from "react-native"

export class LoginPage extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Tic-tac-toe EXTREME!</Text>
        <Text style={styles.loginMessage}>Please log in to continue</Text>
        <LoginForm navigator={this.props.navigator}/>
      </View>
    )
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.onPressIn = this._handleOnStartTouch.bind(this);
    this.onPressOut = this._handleOnEndTouch.bind(this);
    this.onPress = this._nextScene.bind(this);
    this.state = {pressed : false};
  }

  _handleOnStartTouch() {
     this._setTouched(true);
  }

  _handleOnEndTouch() {
     this._setTouched(false);
  }

  _setTouched(touched) {
    this.setState({pressed : touched});
  }

  _nextScene() {
    //alert(JSON.stringify(this.props.navigator));
    this.props.navigator.push({
      name : "Prova",
      component : Prova
    });
  }

  render() {
    return (
      <View>
        <TextInput placeholder="Username" style={{width : 100}}/>
        <TextInput placeholder="Password" style={{width : 100}}/>
        <TouchableHighlight
          activeOpacity={1}
          onPress={this.onPress}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
          style={this.state.pressed ? styles.buttonPressed : styles.button}>
          <Text>
            Login
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={1}
          onPressIn={this.onPressIn}
          onPressOut={this.onPressOut}
          // TODO:  : creare component TouchableHighlight che cambia colore in autonomia, ognuno con un suo state
          style={this.state.pressed ? styles.buttonPressed : styles.button}>
          <Text>
            Register
          </Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button : {
    borderColor : "black",
    backgroundColor:"gray",
    justifyContent : "center",
    padding:10,
    margin:10,
    borderRadius:20
  },
  buttonPressed : {
    borderColor : "black",
    backgroundColor:"lightgray",
    justifyContent : "center",
    padding:10,
    margin:10,
    borderRadius:20
  },
  mainTitle : {
    fontSize : 20,
    color : "black",
    margin:10
  },
  loginMessage : {
    color : "gray",
    margin:10
  }
});
