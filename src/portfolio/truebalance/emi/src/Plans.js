// import 'babel-polyfill';
import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'

import './plans.css';
import Plans_list from './Plans_list';

export default class extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route path="/portfolio/MobileLoan-plans" component={Plans_list} exact/>
          <Route path="/portfolio/MobileLoan-plans/:mcc/:mnc" component={Plans_list}/>
        </div>
      </Router>
    );
  }
}
