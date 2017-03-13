import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ListView,
  View,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import { Application } from '../../../shared_components/application.js';
import { ToggleButton } from '../../buttons/toggleButton.js';
import { LoadingSpinner } from '../../misc/loadingSpinner.js';

const dummySources = [
  'An error occurred, please retry.'
];

const dataSourceModel = new ListView.DataSource({rowHasChanged : (r1, r2) => r1 !== r2});

export class ApiListScene extends Component {
  constructor(props) {
    super(props);
    this.renderRow = this._renderRow.bind(this);
    this.onPressedAdd = this._reqNewAPI.bind(this);
    this.RemoveHandler = this._RemoveHandler.bind(this);
  }

  componentWillMount() {
    this.setState({
      loading : true,
      datasource : dataSourceModel.cloneWithRows([]),
      rows : [],
      isDummy : false,
      token : '',
      selectedToken : ''
    });
  }

  componentDidMount() {
      setTimeout(() => {
        this.getTokens();
      }, 300); //waiting for UI to show before requesting, navigator animation end.
      //TODO : find another way, like triggering navigator.
  }


  _RemoveHandler(token) {
    this.state.rows.splice(this.state.rows.indexOf(token), 1);
    const rows = this.state.rows;
    this.setState({
      rows : rows,
      datasource : dataSourceModel.cloneWithRows(rows)
    });
  }

  _reqNewAPI() {
    //this.setState({loading : true});
    const request = {
      method : 'POST',
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        Type : 'AddToken',
        API_Token : Application.APIToken,
        SessionToken : Application.SessionToken
      })
    };
    fetch('http://gamemate.di.unito.it:8080/dev/api_token/add', request)
        .then((response) => response.json())
        .then((responseJson) => {
          //alert(responseJson)
          switch (responseJson.Type) {
            case 'AddToken':
              ToastAndroid.show('Token successfully requested', ToastAndroid.SHORT);
              this.state.rows.push(responseJson.NewAPI_Token);
              const rows = this.state.rows;
              this.setState({
                rows : rows,
                datasource : dataSourceModel.cloneWithRows(rows)
              });
              break;
              case 'ErrorDetail':
              ToastAndroid.show('Error : ' + responseJson.ErrorDetail, ToastAndroid.SHORT);
              break;
            default:
              ToastAndroid.show('There was a problem while getting the new token', ToastAndroid.LONG);
              break;
          }
          //this.setState({loading : false});
          //alert(JSON.stringify(responseJson));
        })
        .catch((error) => {
          ToastAndroid.show('Problems during the download of the tokens ' +  JSON.stringify(error), ToastAndroid.LONG);
          //this.setState({loading : false});
        });
  }

  getTokens() {
    //this.setState({loading : true});
    const request = {
      method : 'POST',
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        Type : 'DevTokenList',
        API_Token : Application.APIToken,
        SessionToken : Application.SessionToken
      })
    };
    fetch('http://gamemate.di.unito.it:8080/dev/api_token/list', request)
        .then((response) => response.json())
        .then((responseJson) => {
          switch (responseJson.Type) {
            case 'DevTokenList':
              this.setState({
                rows : responseJson.Tokens,
                datasource : dataSourceModel.cloneWithRows(responseJson.Tokens)
              });
              break;
            case 'ErrorDetail':
              ToastAndroid.show('There was a problem : ' + responseJson.ErrorMessage, ToastAndroid.LONG);
              this.setState({
                isDummy : true,
                rows : dummySources,
                datasource : dataSourceModel.cloneWithRows(dummySources)
              });
              break;
            default:
              ToastAndroid.show('There was a problem while getting your tokens', ToastAndroid.LONG);
              this.setState({
                isDummy : true,
                rows : dummySources,
                datasource : dataSourceModel.cloneWithRows(dummySources)
              });
          }
          this.setState({loading : false});
          //alert(JSON.stringify(responseJson));
        }).catch((error) => {
          ToastAndroid.show('Problems during the download of the tokens : ' + JSON.stringify(error), ToastAndroid.LONG);
          this.setState({
            isDummy : true,
            rows : dummySources,
            datasource : dataSourceModel.cloneWithRows(dummySources),
            loading : false
          });
          //alert(JSON.stringify(error));
        });
  }

  render() {
    if(this.state.loading) {
      return (
        <View style={styles.container}>
          <View style={[styles.container, styles.center]}>
            <ActivityIndicator style={styles.loader} animating={true} size='large'/>
            <Text style={styles.loaderText}>Loading tokens...</Text>
          </View>
          <ToggleButton style={[styles.buttonNormal, {maxHeight:100, borderRadius:0}]}
                        onPressed={this.onPressedAdd}
                        underlayColor='gray'
                        text='Generate new token'/>
        </View>
      );
    } else return(
      <View style={styles.container}>
        <ListView style={styles.list}
                  dataSource={this.state.datasource}
                  renderRow={this.renderRow}
          />
        <ToggleButton style={[styles.buttonNormal, {height:100, borderRadius:0}]}
                        underlayColor='gray'
                        onPressed={this.onPressedAdd}
                        text='Generate new token'/>
      </View>
    );
  }

  _renderRow(singleItem) {
    return (
      <TokenRow token={singleItem} isDummy={this.state.isDummy} RemoveHandler={this.RemoveHandler}/>
    );
  }
}

class TokenRow extends Component {
  constructor(props) {
    super(props);
    this.onRemoving = this._onRemoving.bind(this);
  }

  componentWillMount() {
    this.setState({
      removing : false
    });
  }

  _onRemoving() {
    this.setState({removing : true});
    const request = {
      method : 'POST',
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        Type : 'DropToken',
        API_Token : Application.APIToken,
        SessionToken : Application.SessionToken,
        TokenToDrop : this.props.token
      })
    };
    //alert(JSON.stringify(JSON.parse(request.body)))
    fetch('http://gamemate.di.unito.it:8080/dev/api_token/drop', request)
    .then((response) => response.json())
    .then((responseJson) => {
      //alert(JSON.stringify(responseJson));
      switch (responseJson.Type) {
        case 'DropToken':
          ToastAndroid.show('Token successfully deleted', ToastAndroid.SHORT);
          this.props.RemoveHandler(this.props.token);
          break;
        case 'ErrorDetail':
          ToastAndroid.show('Error : ' + responseJson.ErrorMessage, ToastAndroid.SHORT);
          break;
        default:
          ToastAndroid.show('Unknown error while deleting, retry later. ', ToastAndroid.SHORT);
          break;
      }
      this.setState({removing : false});
    }).catch((error) => {
      ToastAndroid.show('Unknown error while handling response, retry later '  + JSON.stringify(error), ToastAndroid.SHORT);
      this.setState({removing : false});
    });
  }

  render() {
    const visible = this.state.isDummy ? 0 : 1;
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>
          {this.props.token}
        </Text>
        {!this.state.isDummy &&
        <View style={{flex:1, flexDirection:'row', marginRight:10}}>
        <LoadingSpinner animating={this.state.removing} />
        <ToggleButton
            style={[styles.buttonNormal, {flex:2, opacity : visible, margin:15}]}
            underlayColor='gray'
            onPressed={this.onRemoving}
            text='Drop'/>
        </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    flexDirection : 'column',
    backgroundColor:'white'
  },
  list: {
    flex:10,
    flexDirection:'column',
    marginTop : 60, //navbar
    //backgroundColor:'red'
  },
  row: {
    flex:1,
    flexDirection:'row',
    paddingTop : 10,
    borderBottomWidth : 1,
    //borderBottomColor:'gray',
    padding : 5
  },
  rowText : {
    flex:2,
    //backgroundColor:'yellow'
  },
  buttonNormal : {
    alignItems:'center',
    justifyContent:'center',
    borderRadius:30,
    backgroundColor : 'lightgray'
  },
  loader : {
    flex:2,
    justifyContent : 'flex-end'
  },
  loaderText : {
    flex : 1
  },
  center : {
    alignItems : 'center'
  }
});
