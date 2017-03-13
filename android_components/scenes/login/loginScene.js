import React, { Component } from 'react';
import { LoginButton } from './loginButton.js';
import { RegisterButton } from './registerButton.js';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Navigator,
  BackAndroid,
  ToastAndroid,
  Alert
} from 'react-native';

export class LoginScene extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Welcome to Gamemate, Developer.</Text>
        <Text style={styles.loginMessage}>Please log in to continue</Text>
        <LoginForm navigator={this.props.navigator}/>
      </View>
    )
  }
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username : '',
      password : ''
    };
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder='Email'
          onChangeText={(username) => this.setState({username})}
          style={{flex:1, maxHeight:70}}/>
        <TextInput
          ref='password'
          onChangeText={(password) => this.setState({password})}
          placeholder='Password'
          secureTextEntry={true}
          style={{flex:1, maxHeight:70, width:300}}/>
        <LoginButton ref='login' navigator={this.props.navigator} username={this.state.username} password={this.state.password}/>
        <RegisterButton ref='registration' navigator={this.props.navigator}  username={this.state.username} password={this.state.password}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    flexDirection:"column",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainTitle : {
    fontSize : 20,
    color : 'black',
    margin:10
  },
  loginMessage : {
    color : 'gray',
    margin:10
  }
});
