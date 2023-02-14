// import 'babel-polyfill';
import React, {Component} from 'react';
import axios from 'axios';
import moment from 'moment';

import img_empty_phone from '../../images/img-empty-no-recharge.svg';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {data: []};
    this.originalData = [];

    // if (false && window.$asset1) {
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
    this.isIdle = {openingPlan: true};
    this.urlPathPrefix = window.$urlPathPrefix || '';
  }

  componentDidMount() {
    if (window.$plans) {
      this.setup(window.$plans);
    } else {
      axios.get('/mockups/truebalance/loan-plans.json')
        .then(response => {
          this.setup(response.data);
          console.log(this.originalData);
        });
    }
  }

  setup(data) {
    for (const row of data) {
      row.charges = 0;
      for (const ins of row.installments) {
        row.charges += ins.loanProductInstallmentCommissionAmount;
      }

      row.tariffDurationDisplay = row.tariff.durationText;

      const ins = row.installments[0];
      row.commissionRate = ins.loanProductInstallmentCommissionRate;
      row.payableAmount = ins.loanProductInstallmentAmount;

      if (row.tariff.updateDate) {
        row.tariff.updateDate = moment(row.tariff.updateDate).valueOf();
      }
    }
    this.originalData = data;
    this.updateProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.mcc !== nextProps.match.params.mcc
      || this.props.match.params.mnc !== nextProps.match.params.mnc) {
      this.updateProps(nextProps);
    }
  }

  updateProps(props) {
    console.log(props.match.params);
    this.setState({data: this.originalData.filter(row => props.match.params.mcc ?
      (row.tariff.mcc.toString() === props.match.params.mcc
        && row.tariff.mnc.toString() === props.match.params.mnc) : true)},
      () => {window.scrollTo(0, 0)});
  }

  onClickPlan(ev) {
    if (this.isIdle.openingPlan) {
      const idx = Number.parseInt(ev.currentTarget.name.substring(5), 10);

      this.isIdle.openingPlan = false;

      axios.get(`${this.urlPathPrefix}/loan/view/stat?productId=${this.state.data[idx].loanProductId}`,
        {headers: this.headers})
        .then(response => {
          let msg = `Sorry, you can't buy this plan`;

          if (response.data.isSelling && response.data.isSellingProduct) {
            msg = null;
          }
          // console.log(msg);
          try {
            window.truebalance.startLoan(JSON.stringify(window.$eligible),
              JSON.stringify(this.state.data[idx]), msg);
          } catch (e) {
            alert(`This content is only available in True Balance app.
${e.message}`);
          }
        }).catch(error => {}).then(() => {this.isIdle.openingPlan = true;});
    }
  }

  render() {
    if (this.state.data.length) {
      return (
        <ul className="list-unstyled container-plan" key="temp_b">
      {this.state.data.map((row, i) =>
        <li className="plan" key={i}>
          <div className="mccmnc">{row.operatorName} - {row.circleName}</div>
          <div className="main">
            <dl>
              <dt className="pull-left">
                <span className="unit">₹</span>{row.tariff.price}
              </dt>
              <dd className="title">{row.loanProductName}</dd>
              <dd className="duration">{row.tariffDurationDisplay}</dd>
            </dl>
            <p>{row.tariff.description}</p>
          </div>
          <div className="row amounts">
            <div className="col-xs-6 total-amount">
              <label>TOTAL AMOUNT DUE</label>₹ {row.loanProductTotalAmount}
            </div>
            <div className="col-xs-3 price">
              <label>PACK VALUE</label>₹ {row.tariff.price}
            </div>
            <div className="col-xs-3 fee">
              <label>CHARGES {row.commissionRate}%</label>₹ {row.charges}
            </div>
          </div>
          <div className="container-btn">
            <button type="button" className="btn btn-block btn-tb"
              name={`item-${i}`} onClick={this.onClickPlan.bind(this)}>
              <small>Now Pay</small><label>₹ {row.payableAmount}</label>
            </button>
          </div>
        </li>
      )}
      </ul>);
    } else {
      return (<div className="no-plan text-center">
        <div><img src={img_empty_phone} alt=""/>
          <h2>No Plan Yet</h2>
        </div>
      </div>);
    }
  }
}
