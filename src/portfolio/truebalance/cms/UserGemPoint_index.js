import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HotTable from 'react-handsontable';
import update from 'react-addons-update';
import axios from 'axios';
import WindowResizeListener from 'window-resize-listener-react';
import InfiniteScroll from 'react-infinite-scroller';
import {toast} from 'react-toastify';

import * as consts from '../Constants';

// if (process.env.NODE_ENV !== 'production') {
//     require('bootstrap/dist/css/bootstrap.css');
// }

// const lang = window.navigator.userLanguage || window.navigator.language;
// import ('moment/locale/' + lang);


export default class extends Component {
    constructor(props) {
        super(props);
        this.urlPrefix = (window.location.host === 'localhost:3000' ? 'http://localhost:8080' : '')
        this.state = {
            toolbarHeight: 0, totalPages: 0,
            settings: {
                data: [], autoWrapRow: true, fillHandle: false, height: 650, autoRowSize: true, stretchH: 'all',
                sortIndicator: true, columnSorting: false,
                colHeaders: ['Updated at', 'Title', 'Description', 'Gem used', 'Gem earned', 'Free point earned',
                    'CS Memo'],
                columns: [
                    {data: 'updatedAt', readOnly: true, className: 'monospace'},
                    {data: 'title', readOnly: true},
                    {data: 'description', readOnly: true},
                    {data: 'amountUsed', readOnly: true, className: 'htRight monospace'},
                    {data: 'amountEarned', readOnly: true, className: 'htRight monospace'},
                    {data: 'obtainedAmount', readOnly: true, className: 'htRight monospace'},
                    {data: 'memo', readOnly: true},
                ]
            },
            currentGemBalance: null, totalEarnedGem: null, totalExchangedGem: null,
        }
        this.scrollPagination = {isRequesting: false, page: 1};
    }

    componentDidMount() {
        // moment.locale(lang);
        // if (window.$userId) {
            this.fetchData(true);

            let toolbar = ReactDOM.findDOMNode(this.refs['toolbar']);
            if (toolbar) {
                this.setState(update(this.state, {toolbarHeight: {$set: toolbar.clientHeight}}));
            }
        // }
    }

    fetchData(isInitial) {
        axios.get(`${this.urlPrefix}/gem/logs/${window.$userId}?page=${this.scrollPagination.page}`)
            .then(response => {
                this.append(response.data, isInitial);
            }).catch(error => {
            if (error.response && error.response.status === 400) {
                consts.goSignin();
            } else {
                axios.get('/mockups/truebalance/user-gem-logs.json')
                    .then(response => {
                        this.append(response.data, isInitial);
                    }).catch(error2 => {
                    toast(consts.NOT_RESPONDING);
                    this.setState(update(this.state, {totalPages: {$set: null}}));
                });
            }
        });
    }

    append(data, isInitial) {
        this.arrange(data.logs);
        this.setState(update(this.state, {
            settings: {
                data: {$push: data.logs},
                columnSorting: {$set: data.totalPages <= this.scrollPagination.page}
            },
            currentGemBalance: {$set: data.balance.amount.toLocaleString()},
            totalEarnedGem: {$set: data.totalEarnedGem.toLocaleString()},
            totalExchangedGem: {$set: data.totalExchangedGem.toLocaleString()},
            totalPages: {$set: data.totalPages}
        }));

        setTimeout(this.onWindowResize.bind(this), 200);
        this.scrollPagination.isRequesting = false;
    }

    arrange(logs) {
        logs.forEach(row => {
            row.updatedAt = consts.getUTCandConvertIndia(row.date).format(consts.DATE_FORMAT_EN_IN);

            switch (row.type) {
                case 'CONSUMPTION':
                    row.amountUsed = row.amount;
                    break;
                case 'INCOME':
                    row.amountEarned = row.amount;
                    break;
                default:
            }
        });

    }

    onWindowResize(windowSize) {
        this.setState(update(this.state, {
            settings: {height: {$set: window.document.querySelector('.ht_master .wtHider').scrollHeight}}
        }));
    }

    render() {
        return (
            <div id="gem-logs" className="panel-body">
                <div ref="toolbar">
                    <div className="row">
                        <div className="col-sm-8 col-md-6 col-lg-4">
                            <table className="table table-bordered table-hover">
                                <thead>
                                <tr>
                                    <td colSpan="2">Gem Point</td>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th>Total gem earned</th>
                                    <td>{this.state.totalEarnedGem}</td>
                                </tr>
                                <tr>
                                    <th>Current gem balance</th>
                                    <td>{this.state.currentGemBalance}</td>
                                </tr>
                                <tr>
                                    <th>Total gem exchanged to free point</th>
                                    <td>{this.state.totalExchangedGem}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-sm-4 col-md-6 col-lg-8 text-right">
                        </div>
                    </div>
                </div>
                <WindowResizeListener onResize={this.onWindowResize.bind(this)}/>
                <div className="container-table" style={{
                    // paddingTop: this.state.toolbarHeight,
                    // marginTop: -this.state.toolbarHeight
                }}>
                    <HotTable root="hot" settings={this.state.settings}/>
                    <div className="status">{
                        this.state.totalPages ? (<small
                            className={this.state.totalPages > this.scrollPagination.page ? 'text-warning' : 'text-success'}>
                            {this.scrollPagination.page} of {this.state.totalPages} page
                            {this.scrollPagination.page > 1 ? 's' : ''} loaded <strong>(This sheet
                            is {this.state.totalPages > this.scrollPagination.page ? 'not yet ' : ''}sortable.)</strong>
                        </small>) : (this.state.totalPages === null ?
                            (<small className="text-danger">{consts.NOT_RESPONDING}</small>) : '')
                    }</div>
                </div>
                <InfiniteScroll
                    loadMore={() => {
                        if (!this.scrollPagination.isRequesting && this.state.totalPages > this.scrollPagination.page) {
                            this.scrollPagination.isRequesting = true;
                            this.scrollPagination.page++;
                            this.fetchData();
                        }
                    }}
                    pageStart={1} hasMore={this.state.totalPages > this.scrollPagination.page}/>
            </div>
        );
    }
}
