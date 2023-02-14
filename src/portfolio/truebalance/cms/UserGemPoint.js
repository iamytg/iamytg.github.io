import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'
import UserGemPointIndex from './UserGemPoint_index';
import './UserGemPoint.css';

export default class extends Component {
    render() {
        return (
            <Router>
                <div className="ibox" style={{clear: 'both'}}>
                    <Route path="/tab-12" render={() => <UserGemPointIndex params={this.props.match.params}/>}/>
                </div>
            </Router>
        );
    }
}
