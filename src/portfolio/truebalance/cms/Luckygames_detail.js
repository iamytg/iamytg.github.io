import React, {Component} from 'react';
import update from 'react-addons-update';
import axios from 'axios';
import WindowResizeListener from 'window-resize-listener-react'
import {toast} from 'react-toastify';

import moment from 'moment';
import 'moment-timezone';
import Flatpickr from 'flatpickr';
import {arrayMove, SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

import * as consts from '../Constants';

import 'flatpickr/dist/themes/material_green.css';

// if (process.env.NODE_ENV !== 'production') {
//     require('bootstrap/dist/css/bootstrap.css');
// }
import './Luckygames.css';

const DragHandle = SortableHandle(({reward, idx}) =>
    <div className="col-md-3 col-lg-2" style={{cursor: 'ns-resize'}}>Reward {String.fromCharCode(65 + idx)}</div>
);

const RewardInput = ({reward, idx, onChangeReward, editable, type}) =>
    <div className={`form-group ${reward.type === consts.enum_rewardTypes.PROBABILITY ||
    reward.type === consts.enum_rewardTypes.FIXED ? ' has-feedback' : ''}`}>
        <input type="text" name={`factorFor${type}_${idx}`} className="form-control" value={reward[`factorFor${type}`]}
               onChange={onChangeReward} readOnly={!editable} required
               disabled={reward.type !== consts.enum_rewardTypes.PROBABILITY &&
               reward.type !== consts.enum_rewardTypes.FIXED}
               maxLength={reward.type === consts.enum_rewardTypes.PROBABILITY ? 5 : 6}/>
        {reward.type === consts.enum_rewardTypes.PROBABILITY || reward.type === consts.enum_rewardTypes.FIXED ?
            <span className="form-control-feedback">{reward.type === consts.enum_rewardTypes.PROBABILITY ? '%' :
                `person${reward[`factorFor${type}`] === 1 ? '' : 's'}`}</span> : null}
    </div>
;

const SortableItem = SortableElement(({reward, idx, onChangeReward, data}) =>
    <li className="list-group-item">
      <div className="row table-condition">
        <DragHandle reward={reward} idx={idx}/>
        <div className="col-md-4 col-lg-3">
            <select name={`type_${idx}`} className="form-control" onChange={onChangeReward} disabled={!data.editable}
                    value={reward.type}>
                {consts.rewardTypes.map((type, i) =>
                    <option value={type.code} key={`type-${idx}-${i}`}>{type.label}</option>
                )}
            </select>
        </div>
        <div className="w-100 d-none d-md-block d-lg-none"></div>
        <div className="col-md-3 col-lg-2 offset-md-3 offset-lg-0">
            <RewardInput reward={reward} idx={idx} onChangeReward={onChangeReward} editable={data.editable}
                         type="Free"/>
        </div>
        <div className="col-md-3 col-lg-2">
            <RewardInput reward={reward} idx={idx} onChangeReward={onChangeReward} editable={data.editable}
                         type="Paid"/>
        </div>
        <div className="col-md-3 col-lg-2">
            <input type="text" name={`amount_${idx}`} className="form-control" value={reward.amount}
                   onChange={onChangeReward} readOnly={!data.editable} required
                   disabled={reward.type !== consts.enum_rewardTypes.PROBABILITY &&
                   reward.type !== consts.enum_rewardTypes.FIXED} maxLength="10"/>
        </div>
      </div>
    </li>
);

const SortableList = SortableContainer(({items, ...props}) =>
    <ul className="list-group">
        {items.map((value, index) => (
            <SortableItem key={`item-${index}`} index={index} reward={value} idx={index} {...props}/>
        ))}
    </ul>
);

const Input = ({label, name, data, refObj, ...props}) =>
    <div className="form-group">
        <label>{label}</label>
        <input type="text" className="form-control" name={name} value={data.period[name]} readOnly={!data.editable}
               ref={node => {
                   if (refObj) {
                       refObj[name] = node;
                   }
               }} {...props}/>
    </div>
;


export default class extends Component {
    constructor(props) {
        super(props);
        this.urlPrefix = (window.location.host === 'localhost:3000' ? 'http://localhost:8080' : '')

        this.state = {
            period: {rewards: [], exceptiveCondition: {}}, temp: {}, editable: false,
            validations: {exceptiveCondition_rewardAmount: null}
        };
        this.periodId = Number.parseInt(this.props.match.params.periodId, 10);

        this.flatpickrOptions = {enableTime: true, onChange: this.onChangeDateTime.bind(this), dateFormat: 'd/m/Y H:i'};
        this.flatpickrs = [{
            options: Object.assign({}, this.flatpickrOptions),
        }, {
            options: Object.assign({}, this.flatpickrOptions),
        }];

        this.elements = {};
    }

    componentDidMount() {
        this.fetchData(true);
    }

    componentWillUnmount() {
        try {
            this.dtp.forEach(dtp => {
                dtp.destroy();
            });
        } catch (e) {
        }
    }

    fetchData(isInitial) {
        axios.get(`${this.urlPrefix}/luckygame/periods/${this.periodId ? this.periodId : 'new'}`)
            .then(response => {
                this.append(response.data, isInitial);
            }).catch(error => {
            if (error.response && error.response.status === 400) {
                consts.goSignin();
            } else {
                axios.get('/mockups/truebalance/luckygame-period-editable.json')
                // axios.get('/mockups/truebalance/luckygame-period-readonly.json')
                // axios.get('/mockups/truebalance/luckygame-period-new.json')
                    .then(response => {
                        this.append(response.data, isInitial);
                    }).catch(error2 => {
                    toast(consts.NOT_RESPONDING);
                });
            }
        });
    }

    append(data, isInitial) {
        const minDate = moment(data.minDate.substring(0, 16));
        let startTime = minDate.clone().format(consts.DATE_FORMAT_EN_IN);
        let endTime = minDate.clone().add(1, 'days').format(consts.DATE_FORMAT_EN_IN);

        if (data.period.id) {
            startTime = consts.getUTCandConvertIndia(data.period.startTime).format(consts.DATE_FORMAT_EN_IN);
            endTime = consts.getUTCandConvertIndia(data.period.endTime).format(consts.DATE_FORMAT_EN_IN);
        }

        let temp = {startTime: startTime, endTime: endTime};
        const runningPeriodId = data.runningPeriod ? data.runningPeriod.id :
            (data.pausedPeriod ? data.pausedPeriod.id : null);
        let isEditable = !data.period.id || (data.period.status !== 'END' && runningPeriodId !== data.period.id);
        data.period.status = runningPeriodId === data.period.id ? 'RUNNING' : data.period.status;

        data.period.exceptiveCondition = data.period.exceptiveCondition ? JSON.parse(data.period.exceptiveCondition) : {};
        // console.log(data.period);
        this.setState(update(this.state, {
            period: {$set: data.period}, temp: {$set: temp}, editable: {$set: isEditable},
            validations: {exceptiveCondition_rewardAmount: {$set: null}},
        }), () => {
            if (isInitial && isEditable) {
                this.dtp = this.flatpickrs.map((pickr, idx) => {
                    const node = this.elements[`dtpInput${idx + 1}`];
                    Object.assign(pickr.options, {
                        minDate: minDate.toDate(),
                        onClose: () => {
                            node.blur && node.blur()
                        },
                        defaultDate: (idx ? endTime : startTime),
                    });
                    return new Flatpickr(node, pickr.options);
                });
            }
        });

        setTimeout(this.onWindowResize.bind(this), 200);
    }

    reorder() {
        this.state.period.rewards.forEach((reward, idx) => {
            reward.order = idx + 1;
        });
    }

    onWindowResize(windowSize) {
        this.setState(update(this.state, {
            // settings: {height: {$set: window.document.querySelector('.ht_master .wtHider').scrollHeight}}
        }));
    }

    onChangeText(ev) {
        const n = ev.target.name;
        let v = ev.target.value;

        switch (n) {
            case 'chargingInterval':
            case 'payablePoint':
            case 'maxFreeTries':
                v = Number.parseInt(v.replace(/\D*/g, ''), 10) || 0;
                break;
            default:
        }

        if (this.state.period[n] !== v) {
            this.setState(update(this.state, {
                period: {[n]: {$set: v}}
            }));
        }
    }

    onChangeDateTime(selectedDates, dateStr, instance) {
        let dates = {[instance.element.name]: {$set: instance.element.value}};

        if (selectedDates.length && instance.element.name === 'startTime') {
            let startTime = moment(instance.element.value, consts.DATE_FORMAT_EN_IN);
            let endTime = moment(this.dtp[1].element.value, consts.DATE_FORMAT_EN_IN);

            this.dtp[1].set('minDate', selectedDates[0]);

            if (startTime.isAfter(endTime)) {
                this.dtp[1].setDate(startTime.toDate(), false);
                dates.endTime = {$set: startTime.format(consts.DATE_FORMAT_EN_IN)};
            }
        }
        this.setState(update(this.state, {temp: dates}));
    }

    onSortEnd({oldIndex, newIndex}) {
        this.setState(update(this.state, {
            period: {rewards: {$set: arrayMove(this.state.period.rewards, oldIndex, newIndex)}}
        }), this.reorder.bind(this));
    }

    onChangeReward(ev) {
        let name = ev.target.name;
        const idx = name.lastIndexOf('_');
        const index = name.substring(idx + 1);
        let val = ev.target.value;
        name = name.substring(0, idx);

        const reward = {};

        if (name === 'type') {
            if (val !== consts.enum_rewardTypes.PROBABILITY && val !== consts.enum_rewardTypes.FIXED) {
                Object.assign(reward, {factorForFree: {$set: ''}, factorForPaid: {$set: ''}, amount: {$set: ''},});
            }
        } else {
            switch (name) {
                case 'amount':
                    val = Number.parseInt(val.replace(/\D*/g, ''), 10) || 0;
                    break;
                default:
            }
        }
        reward[name] = {$set: val};

        this.setState(update(this.state, {
            period: {rewards: {[index]: reward}}
        }), () => {
            switch (name) {
                case 'type':
                case 'amount':
                    clearTimeout(this.timerValidation);
                    this.timerValidation = setTimeout(this.validate_exceptiveCondition_rewardAmount.bind(this), 500);
                    break;
                default:
            }
        });
    }

    onChangeExceptiveConditionType(ev) {
        switch (ev.target.name) {
            case 'type':
                let obj = ev.target.value ? {
                    [ev.target.name]: ev.target.value, prizeAmount: 0,
                    first5List: [null, null, null, null, null]
                } : {};
                this.setState(update(this.state, {
                    period: {exceptiveCondition: {$set: obj}}
                }));
                break;
            default:
        }
    }

    onSubmit(ev) {
        const data = this.state.period;

        ev.preventDefault();

        const totals = {free: 0, paid: 0, failCount: 0};
        this.state.period.rewards.forEach(reward => {
          if (reward.type === consts.enum_rewardTypes.PROBABILITY) {
            totals.free += reward.factorForFree;
            totals.paid += reward.factorForPaid;
          } else if (reward.type === consts.enum_rewardTypes.FAIL) {
            totals.failCount++;
          }
        });

        if (this.dtp[0].element.value === this.dtp[1].element.value) {
            toast('Please check the date.');
            this.elements.dtpInput2.focus();
            return;
        } else if (!this.state.period.chargingInterval) {
            toast('Invalid charging cycle');
            this.elements.chargingInterval.focus();
            return;
        } else if (data.exceptiveCondition.type && !this.validate_exceptiveCondition_rewardAmount()) {
            toast('Invalid reward amount');
            this.elements.prizeAmount.focus();
            return;
        } else if (totals.failCount === 0 && (totals.free < 100 || totals.paid < 100)) {
            toast(`Please make at least one fail result.`);
            return;
        }

        this.dtp.forEach(instance => {
            data[instance.element.name] = moment(`${instance.element.value} +05:30`, `${consts.DATE_FORMAT_EN_IN} Z`).unix();
        });

        console.debug(data);

        if (window.confirm(`Would you really save?`)) {
            axios.post(`${this.urlPrefix}/luckygame/period`, data)
                .then(response => {
                    if (response.data.result !== 1000) {
                        toast(response.data.description);
                    } else if (!this.periodId) {
                        window.location.href = `#/periods/${response.data.period.id}`;
                    } else {
                        this.fetchData();
                        toast('Saved successfully.');
                    }
                }).catch(error => {
                if (error.response && error.response.status === 400) {
                    consts.goSignin();
                } else {
                    console.error(error);
                }
            });
        }
    }

    command(type) {
        if (window.confirm(`Would you really ${type.toLowerCase()}?`)) {
            axios.post(`${this.urlPrefix}/luckygame/command`, {type: type, id: this.periodId})
                .then(response => {
                    if (response.data.result !== 1000) {
                        toast(response.data.description);
                    } else {
                        switch (type) {
                            case 'STOP':
                                this.fetchData();
                                break;
                            case 'DELETE':
                                window.location.href = '#/';
                                break;
                            default:
                        }
                    }
                }).catch(error => {
                if (error.response && error.response.status === 400) {
                    consts.goSignin();
                } else {
                    console.error(error);
                }
            });
        }
    }

    render_exceptiveCondition() {
        if (this.state.period.exceptiveCondition) {
            switch (this.state.period.exceptiveCondition.type) {
                case consts.enum_exceptiveConditionTypes.FIRST_5:
                    return [
                        <div className="col-md-6 d-none d-md-block d-xl-none" key="A">&nbsp;</div>,
                        <div className="col-md-2 d-none d-md-block d-xl-none" key="B">&nbsp;</div>,
                        [0, 1, 2, 3, 4].map((_, seq) =>
                            <div className="col-md-2 col-xl-1" key={`C${seq}`}>
                                <div className="form-group">
                                    <label>{seq + 1}
                                        <sup>{seq === 0 ? 'st' : seq === 1 ? 'nd' : seq === 2 ? 'rd' : 'th'}</sup> try
                                    </label>
                                    <select name={`seq_${seq}`} className={`form-control${
                                        this.state.period.exceptiveCondition.first5List[seq] === null ? '' :
                                            this.state.period.exceptiveCondition.first5List[seq] ?
                                                ' bg-success' : ' bg-danger'}`}
                                            disabled={!this.state.editable}
                                            value={this.state.period.exceptiveCondition.first5List[seq]}
                                            onChange={(ev) => {
                                                let val = ev.target.value === '' ? null : ev.target.value === 'true';
                                                this.setState(update(this.state, {
                                                    period: {exceptiveCondition: {first5List: {[seq]: {$set: val}}}}
                                                }));
                                            }}>{
                                        consts.exceptiveConditionFirst5.map((item, seq2) =>
                                            <option value={item.code} key={`C${seq}-${seq2}`}>{item.label}</option>)
                                    }</select>
                                </div>
                            </div>),
                        <div className="col-md-2 d-none d-sm-block d-xl-none" key="D">&nbsp;</div>,
                        <div className="col-md-3 col-xl-2" key="E">
                            <div
                                className={`form-group${this.state.validations.exceptiveCondition_rewardAmount === null ?
                                    '' : this.state.validations.exceptiveCondition_rewardAmount ?
                                        ' has-success has-feedback' : ' has-error has-feedback'}`}>
                                <label>Reward amount</label>
                                <input type="text" name={`prizeAmount`} className="form-control" ref={node => {
                                    this.elements.prizeAmount = node
                                }} value={this.state.period.exceptiveCondition.prizeAmount}
                                       readOnly={!this.state.editable} maxLength="10"
                                       onChange={this.onChange_exceptiveCondition_rewardAmount.bind(this)}/>
                                <span
                                    className={`glyphicon form-control-feedback ${
                                        this.state.validations.exceptiveCondition_rewardAmount === null ? 'hide' :
                                            this.state.validations.exceptiveCondition_rewardAmount ?
                                                'glyphicon-ok' : 'glyphicon-remove'}`}
                                    aria-hidden="true"></span>
                            </div>
                        </div>
                    ];
                default:
            }
        }
    }

    onChange_exceptiveCondition_rewardAmount(ev) {
        this.setState(update(this.state, {
            period: {
                exceptiveCondition: {prizeAmount: {$set: Number.parseInt(ev.target.value.replace(/\D*/g, ''), 10) || 0}}
            }
        }), () => {
            clearTimeout(this.timerValidation);
            this.timerValidation = setTimeout(() => {
                if (!this.validate_exceptiveCondition_rewardAmount()) {
                    toast('Invalid reward amount');
                }
            }, 500);
        });
    }

    validate_exceptiveCondition_rewardAmount() {
        let isOK = false;
        this.state.period.rewards.forEach((reward) => {
            if (reward.type === consts.enum_rewardTypes.PROBABILITY &&
                reward.amount === this.state.period.exceptiveCondition.prizeAmount) {
                isOK = true;
            }
        });

        this.setState(update(this.state, {validations: {exceptiveCondition_rewardAmount: {$set: isOK}}}));
        return isOK;
    }


    render() {
        return (
            <div id="luckygame" className="col-lg-12">
                <form ref="toolbar" className="ibox" onSubmit={this.onSubmit.bind(this)}>
                    <div className="ibox-title">
                        <div className="row">
                            <div className="col-sm-5"><h5>{this.periodId ?
                                (this.state.editable ? 'Edit' : 'View') : 'New'} Promotion
                                {this.periodId && !this.state.editable ? ' Details' : ''}</h5></div>
                            <div className="col-sm-7 text-right">
                                {this.state.editable ? [
                                    <label className="checkbox-inline" key="A"><input
                                        type="checkbox" checked={this.state.period.status !== 'DRAFT'}
                                        onChange={(ev) => {
                                            this.setState(update(this.state, {
                                                period: {status: {$set: ev.target.checked ? 'SCHEDULED' : 'DRAFT'}}
                                            }));
                                        }} disabled={!this.state.editable}/> Scheduled Run</label>, ` `,
                                    <button className="btn btn-sm btn-primary" key="B">Save</button>, ` `,
                                    this.periodId ?
                                        <button type="button" className="btn btn-sm btn-danger btn-outline" key="C"
                                                onClick={() => {
                                                    this.command('DELETE');
                                                }}>Delete</button> : null
                                ] : this.state.period.status === 'RUNNING' ?
                                    <button type="button" className="btn btn-sm btn-warning" onClick={() => {
                                        this.command('STOP');
                                    }}>Stop</button> : null}
                            </div>
                        </div>
                    </div>
                    <div className="ibox-content">
                        <div className="row">
                            <div className="col-lg-4">
                                <Input label="Title" name="title" data={this.state} required
                                       onChange={this.onChangeText.bind(this)} maxLength="30"/>
                            </div>
                            <div className="col-lg-8">
                                <Input label="Description" name="description" data={this.state} required
                                       onChange={this.onChangeText.bind(this)}/>
                            </div>
                        </div>
                        <div className="row period clearfix">
                            <div className="col-sm-5 col-md-4 col-lg-3">
                                <div className="form-group has-feedback">
                                    <label>Period</label>
                                    <input name="startTime" className="form-control" readOnly={!this.state.editable}
                                           ref={node => {
                                               this.elements.dtpInput1 = node
                                           }} value={this.state.temp.startTime}/>
                                    <span className="glyphicon glyphicon-calendar form-control-feedback"></span>
                                </div>
                            </div>
                            <div className="col-sm-1 d-none d-sm-block" style={{textAlign: 'center', paddingTop: 38}}>~</div>
                            <div className="col-sm-5 col-md-4 col-lg-3">
                                <div className="form-group has-feedback">
                                    <label className="d-none d-sm-block">&nbsp;</label>
                                    <input name="endTime" className="form-control" readOnly={!this.state.editable}
                                           ref={node => {
                                               this.elements.dtpInput2 = node
                                           }} value={this.state.temp.endTime}/>
                                    <span className="glyphicon glyphicon-calendar form-control-feedback"></span>
                                </div>
                            </div>
                        </div>
                        <div className="row period">
                            <div className="col-sm-5 col-md-4 col-lg-3">
                                <Input label="Max Free Tries" name="maxFreeTries" data={this.state}
                                       required onChange={this.onChangeText.bind(this)} maxLength="3"
                                       refObj={this.elements}/>
                            </div>
                            <div className="col-8 col-sm-5 col-md-4 col-lg-3">
                                <Input label="Free Tries Charging Cycle" name="chargingInterval" data={this.state}
                                       required onChange={this.onChangeText.bind(this)} maxLength="3"
                                       refObj={this.elements}/>
                            </div>
                            <div className="col-4 col-sm-2" style={{padding: '38px 0 0'}}>minute
                                {this.state.period.chargingInterval === 1 ? '' : 's'}</div>
                        </div>
                        <div className="row">
                            <div className="col-8 col-sm-5 col-md-4 col-lg-3">
                                <Input label="Paid tries gem amount" name="payablePoint" data={this.state}
                                       required onChange={this.onChangeText.bind(this)} maxLength="3"
                                       refObj={this.elements}/>
                            </div>
                            <div className="col-4" style={{padding: '38px 0 0'}}>gem
                                {this.state.period.payablePoint === 1 ? '' : 's'}</div>
                        </div>
                        <div className="row paid-try-limit">
                            <div className="col-sm-5 col-md-4 col-lg-3">
                                <Input label="Max Paid Tries Per Day" name="maxPaidTriesPerDay" data={this.state}
                                        required onChange={this.onChangeText.bind(this)} maxLength="3"
                                        refObj={this.elements}/>
                            </div>
                            <div className="col-8 col-sm-5 col-md-4 col-lg-3">
                                <Input label="Max Sequential Paid Tries" name="maxPaidTries" data={this.state}
                                        required onChange={this.onChangeText.bind(this)} maxLength="3"
                                        refObj={this.elements}/>
                            </div>
                        </div>
                        <div className="row text-center padding" style={{marginTop: 15}}>
                            <div className="col-md-4 col-lg-3 offset-md-3 offset-lg-2">Type</div>
                            <div className="col-md-5 d-none d-md-block d-lg-none">&nbsp;</div>
                            <div className="col-md-3 col-lg-2 offset-md-3 offset-lg-0">Value (Free try)</div>
                            <div className="col-md-3 col-lg-2">Value (Paid try)</div>
                            <div className="col-md-3 col-lg-2">Reward amount</div>
                        </div>
                        <SortableList items={this.state.period.rewards} lockAxis="y" useDragHandle={true}
                                      useWindowAsScrollContainer={true}
                                      onSortEnd={this.onSortEnd.bind(this)}
                                      onChangeReward={this.onChangeReward.bind(this)} data={this.state}/>

                        <div className="row table-condition padding">
                            <div className="col-sm-2">Exception</div>
                            <div className="col-sm-4 col-md-3">
                                <label
                                    className={`d-none d-lg-block${
                                        this.state.period.exceptiveCondition.type ? '' : ' hide'}`}>&nbsp;</label>
                                <select name={`type`} className="form-control" disabled={!this.state.editable}
                                        onChange={this.onChangeExceptiveConditionType.bind(this)}
                                        value={this.state.period.exceptiveCondition.type}>
                                    <option value="">Select exception type</option>
                                    {consts.exceptiveConditionTypes.map((type, i) =>
                                        <option value={type.code} key={`type-${i}`}>{type.label}</option>
                                    )}
                                </select>
                            </div>
                            {this.render_exceptiveCondition()}
                        </div>
                    </div>
                </form>
                <WindowResizeListener onResize={this.onWindowResize.bind(this)}/>
            </div>
        );
    }
}
