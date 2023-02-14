import React, { Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {tomorrowNight} from 'react-syntax-highlighter/styles/hljs';

export default class extends Component {
  constructor(props) {
    super(props);

    let lang = props.language;

    if (lang.indexOf('.json') > 0) {
      lang = 'json';
    }
    this.state = {language: lang};
  }

  render() {
    return ([
      <strong key={0}>* {this.props.language}</strong>,
      <SyntaxHighlighter key={1} language={this.state.language}
        style={tomorrowNight}>{this.props.value}</SyntaxHighlighter>
      ]
    );
  }
}
