import React, { Component } from 'react';
import { StyleSheet, Navigator, ToastAndroid, View } from 'react-native';
import { ToggleButton } from '../../buttons/toggleButton.js';
import { Application } from '../../../shared_components/application.js';
import { ApiListScene } from '../api_list/apiListScene.js';
import { LoadingSpinner } from '../../misc/loadingSpinner.js';


export class RegisterButton extends Component {
  constructor(props) {
    super(props);
    this.onPressed = this._onPressed.bind(this);
  }

  componentWillMount() {
    this.state = {
      username : this.props.username == null ? this.props.username : '',
      password : this.props.password == null ? props.password : '',
      loading : false
    };
  }

  _onPressed() {
    this.setState({loading : true});
    const { username, password } = this.props;
    if (username != null && username != '' && password != null && password != '') {
      let request = {
        method : 'POST',
        headers : {
          'Accept' : 'application/json',
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({  //server/models/developer/registration
          Type : 'DevRegistration',
          Email: username,
          Password: password,
          API_Token: Application.APIToken
        })
      };
      let response = fetch('http://gamemate.di.unito.it:8080/dev/register', request)
          .then((response) => response.json())
          .then((responseJson) => {
            switch (responseJson.Type) {
              case 'DevSessionToken':
                Application.SessionToken = responseJson.SessionToken;
                this.setState({loading : false});
                this.props.navigator.push({
                  name : 'Your API Tokens',
                  component : ApiListScene
                });
                break;
              case 'ErrorDetail':
                this.setState({loading : false});
                ToastAndroid.show('Error : ' + responseJson.ErrorMessage, ToastAndroid.LONG);
                break;
              default:
                this.setState({loading : false});
                ToastAndroid.show('Unknown error, retry later' + JSON.stringify(responseJson), ToastAndroid.LONG);
                break;
            }
          }).catch((error) => {
            this.setState({loading : false});
            ToastAndroid.show('Please check your network connection ', ToastAndroid.SHORT);
          });
    }
    else {
      ToastAndroid.show('Please fill username and password fields', ToastAndroid.SHORT);
    }
  }

  render() {
    if(this.state.loading) {
      return (
        <LoadingSpinner style={styles.spinner} animating={this.state.loading}/>
      );
    } else {
      return (
          <ToggleButton
            style={styles.normal}
            onPressed={this.onPressed}
            underlayColor="gray"
            text='Register'/>
      );
    }
  }
}

const styles = StyleSheet.create({
  normal : {
    flex:1,
    borderColor : 'black',
    backgroundColor:'gray',
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    margin:10,
    borderRadius:20,
    maxHeight:80
  },
  spinner : {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
    margin:10,
    borderRadius:20,
    maxHeight:80,
  }
});
