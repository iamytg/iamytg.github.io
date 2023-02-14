// import 'babel-polyfill';
import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'

import './history.css';
import History_list from './History_list';

export default class extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/" component={History_list} exact/>
          <Route path="/:id" component={History_list}/>
        </div>
      </Router>
    );
  }
}
