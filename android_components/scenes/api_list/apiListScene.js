import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Navigator
} from 'react-native';

import { TokenList } from './tokenList.js';

export class ApiListScene extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{flex : 1, backgroundColor: 'white' }}>
        <TokenList/>
      </View>
    );
  }
}
