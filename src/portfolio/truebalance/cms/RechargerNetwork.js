import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'
import Instructions from './Instructions';
import './RechargerNetwork.css';

export default class extends Component {
    render() {
        return (
            <Router>
                <div className="row">
                    <Route path="/instructions" render={() => <Instructions search={this.props.location.search}/>}/>
                </div>
            </Router>
        );
    }
}
