import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import HotTable from 'react-handsontable';
import update from 'react-addons-update';
import axios from 'axios';
import WindowResizeListener from 'window-resize-listener-react';
import InfiniteScroll from 'react-infinite-scroller';
import {toast} from 'react-toastify';
import ReactGantt from 'gantt-for-react';

import moment from 'moment';

// eslint-disable-next-line
import Snap from 'snapsvg-cjs'; // ReactGantt에서 사용함

import * as consts from '../Constants';
import ModalGemPacks from './Modal_GemPacks';

// const lang = window.navigator.userLanguage || window.navigator.language;
// import ('moment/locale/' + lang);
import './Luckygames.css';

window.moment = moment;

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = this.getInitState();
        this.initialize();
    }

    initialize() {
        this.urlPrefix = (window.location.host === 'localhost:3000' ? 'http://localhost:8080' : '');
        this.scrollPagination = {isRequesting: false, page: 1};
    }

    getInitState() {
        return {
            toolbarHeight: 0, totalPages: 1,
            settings: {
                data: [], autoWrapRow: true, fillHandle: false, height: 650, autoRowSize: true, stretchH: 'all',
                sortIndicator: true, columnSorting: false,
                colHeaders: ['Promotion Period', 'Title', 'Description', 'Create user', 'Modify date', 'Status'],
                columns: [
                    {data: 'period', readOnly: true, className: 'htMiddle monospace'},
                    {data: 'titleHtml', readOnly: true, renderer: 'html'},
                    {data: 'description', readOnly: true},
                    {data: 'creatorName', readOnly: true, className: 'htCenter htMiddle'},
                    {data: 'updateDate', readOnly: true, className: 'htCenter htMiddle monospace'},
                    {data: 'status', readOnly: true, className: 'htMiddle'}
                ]
            },
            gantt: {
                viewMode: 'Week', scrollOffsets: {}, onProgressChange: (task, progress) => {
                }, tasks: [
                    // {id: '0', name: '', start: new Date(), end: new Date(), progress: 0,}
                ],
            },
            runningPeriodId: null, pausedPeriodId: null,
            modalPackages: {isOpen: false},
        };
    }

    componentDidMount() {
        // moment.locale(lang);
        this.fetchData(true);

        let toolbar = ReactDOM.findDOMNode(this.refs['toolbar']);
        if (toolbar) {
            this.setState(update(this.state, {
                toolbarHeight: {$set: toolbar.clientHeight}
            }));
        }
    }

    fetchData(isInitial) {
        axios.get(`${this.urlPrefix}/luckygame/periods?page=${this.scrollPagination.page}`)
            .then(response => {
                this.append(response.data, isInitial);
            }).catch(error => {
            if (error.response && error.response.status === 400) {
                consts.goSignin();
            } else {
                axios.get('/mockups/truebalance/luckygame-periods.json')
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
        this.arrange(data.periods, data.runningPeriod, data.pausedPeriod);
        let ganttTasks = this.generateGanttTasks(data.periods, data.runningPeriod);

        const state = {
            settings: {
                data: {[isInitial ? '$set' : '$push']: data.periods},
                columnSorting: {$set: data.totalPages <= this.scrollPagination.page},
            },
            totalPages: {$set: data.totalPages},
            gantt: {tasks: {[isInitial ? '$set' : '$push']: ganttTasks}},
        };

        if (data.runningPeriod) {
            state.runningPeriodId = {$set: data.runningPeriod.id};
        }
        if (data.pausedPeriod) {
            state.pausedPeriodId = {$set: data.pausedPeriod.id};
        }

        this.setState(update(this.state, state), () => {
            setTimeout(this.onWindowResize.bind(this), 100);
            this.scrollPagination.isRequesting = false;
        });
    }

    arrange(periods, runningPeriod, pausedPeriod) {
        periods.forEach(row => {
            row.period = `${consts.getUTCandConvertIndia(row.startTime).format(consts.DATE_FORMAT_EN_IN)} ~
            ${consts.getUTCandConvertIndia(row.endTime).format(consts.DATE_FORMAT_EN_IN)}`;
            // row.titleHtml = `<a href="#/periods/${row.id}">${row.title}</a>`;
            row.titleHtml = `<a href="#/portfolio/CMS-luckygames-detail">${row.title}</a>`;
            row.updateDate = consts.getUTCandConvertIndia(row.updateDate).format(consts.DATE_FORMAT_EN_IN);

            if (!!runningPeriod && row.status === 'SCHEDULED' && runningPeriod.id === row.id) {
                row.status = 'RUNNING';
            }
            if (!!pausedPeriod && row.status === 'SCHEDULED' && pausedPeriod.id === row.id) {
                row.status = 'PAUSED';
            }
        });
    }

    generateGanttTasks(periods, runningPeriod) {
        let arr = periods.filter(row => row.status !== 'END').map(row => {
            return {
                id: row.id.toString(), name: row.title,
                start: consts.getUTCandConvertIndia(row.startTime).format(consts.DATE_FORMAT_KO_KR),
                end: consts.getUTCandConvertIndia(row.endTime).format(consts.DATE_FORMAT_KO_KR),
                progress: row.status !== 'DRAFT' ? 100 : 0,
                period: row.period, status: row.status,
            };
        });
        return arr;
    }

    onWindowResize(windowSize) {
        this.setState(update(this.state, {
            settings: {height: {$set: window.document.querySelector('.ht_master .wtHider').scrollHeight}}
        }));
    }

    pause(type) {
        if (window.confirm(`Would you really ${type.toLowerCase()}?`)) {
            axios.post(`${this.urlPrefix}/luckygame/command`, {type: type})
                .then(response => {
                    console.log(response);
                    if (response.data.result !== 1000) {
                        toast(response.data.description);
                    }

                    this.setState(this.getInitState(), this.componentDidMount.bind(this));
                    this.initialize();
                }).catch(error => {
                if (error.response && error.response.status === 400) {
                    consts.goSignin();
                } else {
                    console.error(error);
                }
            });
        }
    }

    closeModal = () => {
      this.setState(update(this.state, {
        modalPackages: {isOpen: {$set: false}
      }}));
    }


    render() {
        return (
            <div id="luckygame-list" className="col-lg-12">
                <div ref="toolbar" className="ibox">
                    <div className="ibox-title">
                        <div className="row">
                            <div className="col-sm-5"><h5>Lucky Promotions</h5></div>
                            <div className="col-sm-7 text-right">
                              <button type="button" className="btn btn-sm btn-info" onClick={() => {
                                this.setState(update(this.state, {
                                  modalPackages: {isOpen: {$set: true}
                                }}));
                              }}>Manage Redeem Point Packs</button> &nbsp;
                                {this.state.runningPeriodId ?
                                    <button type="button" className="btn btn-sm btn-warning" onClick={() => {
                                        this.pause('PAUSE');
                                    }}>Pause</button> : null} &nbsp;
                                {this.state.pausedPeriodId ?
                                    <button type="button" className="btn btn-sm btn-success" onClick={() => {
                                        this.pause('RESTART');
                                    }}>Restart</button> : null} &nbsp;
                                <a type="button" className="btn btn-sm btn-primary" href="#/portfolio/CMS-luckygames-detail">New Promotion</a>
                            </div>
                        </div>
                    </div>
                    <div className="ibox-content">
                        <div style={{overflow: 'scroll', marginBottom: 25}}>{this.state.gantt.tasks.length ?
                            <ReactGantt
                                tasks={this.state.gantt.tasks} viewMode={this.state.gantt.viewMode}
                                scrollOffsets={this.state.gantt.scrollOffsets}
                                onDateChange={(task, start, end) => {
                                    toast(`This gantt chart can only be seen.
                                    Please change the date on the detail page.`);

                                    this.setState(update(this.state, {
                                        gantt: {
                                            onProgressChange: {
                                                $set: (task, progress) => {
                                                }
                                            }
                                        }
                                    }));
                                }}
                                onProgressChange={this.state.gantt.onProgressChange}
                                customPopupHtml={task => {
                                    return `
                                        <div class="details-container">
                                            <h5>${task.name}</h5>
                                            <p>Period: ${task.period}</p>
                                            <p>Status: ${task.status}</p>
                                        </div>
                                    `;
                                }}/> : null}
                        </div>
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
                    </div>
                </div>
                <WindowResizeListener onResize={this.onWindowResize.bind(this)}/>
                <InfiniteScroll
                    fetchFunc={() => {
                        if (!this.scrollPagination.isRequesting && this.state.totalPages > this.scrollPagination.page) {
                            this.scrollPagination.isRequesting = true;
                            this.scrollPagination.page++;
                            this.fetchData();
                        }
                    }}
                    pageStart={1} hasMore={this.state.totalPages > this.scrollPagination.page}/>
                <ModalGemPacks isOpen={this.state.modalPackages.isOpen} close={this.closeModal}/>
            </div>
        );
    }
}
