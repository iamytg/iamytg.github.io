import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom'
import Luckygames_list from './Luckygames_list';
import Luckygames_detail from './Luckygames_detail';
import './Luckygames.css';

export default class extends Component {
    render() {
        return (
            <Router>
                <div className="row">
                    <Route path="/" component={Luckygames_list} exact/>
                    <Route path="/new" component={Luckygames_detail}/>
                    <Route path="/periods/:periodId" component={Luckygames_detail}/>
                </div>
            </Router>
        );
    }
}