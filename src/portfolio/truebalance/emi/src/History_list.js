// import 'babel-polyfill';
import React, {Component} from 'react';
import update from 'react-addons-update';
import axios from 'axios';
import Sticky from 'react-sticky-el';
// import MotionScroll from 'react-motion-scroll';
import moment from 'moment';
import 'moment-timezone';

import * as consts from '../Constants';

import icon_check_on from '../../images/ic-check-circle-on.svg';
import icon_check_off from '../../images/ic-check-circle-off.svg';
import img_phone from '../../images/ic-wallet-number.svg';
import img_empty_phone from '../../images/img-empty-no-recharge.svg';

const Content = ({scrollTo, state, onChangeCheck, log}) => {
  if (state.statusLoad) {
    if (state.list.length) {
      return (
      <ul className="list-unstyled">
        {state.list.map((b, i1) =>
        <li id={`block-${i1}`} style={{position: 'relative'}} key={i1}>
          <Sticky boundaryElement={`#block-${i1}`} scrollElement=".history"
            hideOnBoundaryHit={false}>
            <dl className="header">
              <dd className="pull-left"><img src={img_phone} alt=""/></dd>
              <dt>{b.loanUserPhoneNo}</dt>
              <dd>{`${b.operatorName} - ${b.circleName}`}</dd>
            </dl>
          </Sticky>
          <ul className="list-unstyled plans">
            <li className="plan">
              <div className="row amounts">
                <div className="col-xs-6 total-amount">
                  <label>TOTAL AMOUNT DUE</label>₹ {Number.parseFloat(b.loanProductTotalAmount)}
                </div>
                <div className="col-xs-3 price">
                  <label>PACK VALUE</label>₹ {Number.parseFloat(b.tariffPrice)}
                </div>
                <div className="col-xs-3 fee">
                  <label>CHARGES {b.loanBookInstallments[0].loanProductInstallmentCommissionRate}
                    %</label>₹ {b.charges}
                </div>
              </div>
              <ul className="list-unstyled clearfix payments">
                {b.loanBookInstallments.map((p, i2) =>
                  <li className={`clearfix ${p.type} ${p.loanInstallmentStatus === 'UNPAID' || p.diffDays < 0 ? 'overdue' : ''}`} key={i2}>
                    <div className="check-circle pull-left">
                      <input type="checkbox" id={`chk-${i1}-${i2}`} checked={p.etcInfo.marked}
                        onChange={onChangeCheck}/>
                    </div>
                    <div className="amount pull-left">₹ {p.amount}</div>
                    <div className="date pull-left">{p.date}</div>
                    <label htmlFor={`chk-${i1}-${i2}`}>
                      <img src={p.etcInfo.marked ? icon_check_on : icon_check_off} alt=""/>
                    </label>
                    <div className="container-btn pull-left">
                      <button type="button" name={`pay-${i1}-${i2}`} className="btn btn-block"
                        disabled={p.type === 'paid'} onClick={(ev) => {
                          const name = ev.target.name.substring(4).split('-');
                          const idxProduct = Number.parseInt(name[0], 10);
                          const idxInstallment = Number.parseInt(name[1], 10);
                          const product = state.list[idxProduct];
                          const ins = product.payableInstallment;
                          const isShaved = ins.installmentId !==
                            product.loanBookInstallments[idxInstallment].installmentId;

                          try {
                            window.truebalance.startPay(JSON.stringify(product), ins.installmentId,
                              isShaved ? 'Please pay previous installment first.' : null);
                          } catch (e) {
                            alert('This content is only available in True Balance app. ' + e.message);
                          }
                        }}>
                        {p.type === 'paid' ? 'PAID' : 'PAY'}
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </li>
      )}
      </ul>);
    } else {
      return (<div className="empty-state text-center">
        <div><img src={img_empty_phone} alt=""/>
          <h2>No History</h2>
        </div>
      </div>);
    }
  } else {
    return (<div>Loading...</div>);
  }
};

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {statusLoad: false, list: [], log: []};

    if (window.$asset1) {
      this.headers = {
        token: window.$asset1.token,
        signature: window.$asset2,
        andid: window.$asset1.andid,
        versioncode: window.$asset1.versionCode,
      };
    } else {
      this.headers = {'userId': 'aaabbbccc1818'};
    }
    this.currentDate = moment(moment(window.$current || "2017-11-26T11:30:15.583+09:00")
      .tz(consts.TZ_INDIA).format(consts.DATE_FORMAT_DATE_ONLY));

    this.isIdle = {checking: true};
    this.urlPathPrefix = window.$urlPathPrefix || '';
  }

  componentDidMount() {
    // this.fetch(true);
    try {
      if (window.$history) {
        this.setup(window.$history);
      } else {
        axios.get('/mockups/truebalance/loan-history.json')
          .then(response => {
            this.setup(response.data);
          });
      }
    } catch(err) {
      alert(err);
    }
  }

  fetch(isInitial) {
    axios.get(`${this.urlPathPrefix}/loan/book/list`, {headers: this.headers})
      .then(response => {
        this.setup(response.data.loanBookList);
      }).catch(error => {
        axios.get('/mockups/truebalance/loan-history.json')
            .then(response => {
                this.setup(response.data);
            }).catch(error2 => {
              console.error(error2);
        });
      });
  }

  setup(data) {
    for (const row of data) {
      row.charges = 0;
      row.payableInstallment = null;

      for (const ins of row.loanBookInstallments) {
        row.charges += ins.loanProductInstallmentCommissionAmount;
        ins.amount = ins.installmentAmount;

        let m = moment(moment(
          ins.actualInstallmentDate || ins.expectInstallmentDate
        ).tz(consts.TZ_INDIA).format(consts.DATE_FORMAT_DATE_ONLY));
        ins.date = m.format(consts.DATE_FORMAT_LOAN);
        ins.diffDays = !ins.actualInstallmentDate ? m.diff(this.currentDate, 'days') : 0;
        ins.isPayable = !ins.actualInstallmentDate && (ins.diffDays <= 0 || (ins.diffDays > 0 && !row.payableInstallment));
        if (ins.isPayable && !row.payableInstallment) {
          row.payableInstallment = ins;
        }
        ins.type = !ins.actualInstallmentDate ? (ins.isPayable ? 'payable' : 'will-pay') : 'paid';

        try {
          ins.etcInfo = JSON.parse(ins.etcInfo);
        } catch (err) {
        }

        if (!ins.etcInfo) {
          ins.etcInfo = {marked: false};
        }
      }
    }
    this.setState(update(this.state, {
      statusLoad: {$set: true}, list: {$push: data}
    }));
    // console.log(data);
  }

  onChangeCheck(ev) {
    if (this.isIdle.checking) {
      const id = ev.target.id.substring(4).split('-');
      const idxProduct = Number.parseInt(id[0], 10);
      const idxInstallment = Number.parseInt(id[1], 10);
      const ins = this.state.list[idxProduct].loanBookInstallments[idxInstallment];
      const etcInfo = Object.assign({}, ins.etcInfo);
      etcInfo.marked = ev.target.checked;

      this.isIdle.checking = false;

      axios.post(`${this.urlPathPrefix}/loan/book/installment/${ins.loanBookId}/${ins.installmentId}`,
        etcInfo, {headers: this.headers})
        .then(response => {
          if (response.data.result) {
            this.setState(update(this.state, {
              list: {[idxProduct]: {loanBookInstallments: {[idxInstallment]:
                {etcInfo: {marked: {$set: etcInfo.marked}}}
              }}}
            }));

            if (etcInfo.marked) {
              try {
                // window.truebalance.notifyCheckedInstallment('You can use Check button to manage history. Please note it does NOT actually pay the amount.');
                window.truebalance.notifyCheckedInstallment();
              } catch (e) {
                alert('This content is only available in True Balance app. ' + e.message);
              }
            }
          }
        }).catch(error => {}).then(() => {this.isIdle.checking = true;});
    }
  }

  log(msg) {
    this.setState(update(this.state, {log: {$unshift: [`[${moment().format('LTS')}] ${msg}`]}}));
  }

  // render() {
  //   return (
  //     <MotionScroll height="100vh" className="history">
  //       <Content state={this.state} onChangeCheck={this.onChangeCheck.bind(this)} />
  //     </MotionScroll>
  //   );
  // }

  render() {
    return (
      <div style={{position: 'relative', height: '100vh'}} className="history">
        <Content state={this.state} onChangeCheck={this.onChangeCheck.bind(this)}/>
      </div>
    );
  }
}
