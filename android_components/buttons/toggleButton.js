import React, { Component } from 'react';
import { TouchableHighlight, Text } from 'react-native';

export class ToggleButton extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.props.onPressed.bind(this);
  }

  render() {
    return (
      <TouchableHighlight style={this.props.style}
                          onPress={this.onPress}
                          underlayColor={this.props.underlayColor}>
        <Text>
          {this.props.text}
        </Text>
      </TouchableHighlight>
    );
  }
}
