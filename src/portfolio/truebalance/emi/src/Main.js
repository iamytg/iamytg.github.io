// import 'babel-polyfill';
import React, {Component} from 'react';
import update from 'react-addons-update';
import {Link} from 'react-router-dom';

import './main.css';
// import icon_warn from '../../images/ic-error-18-px.svg';
import svg_intro from '../../images/img-emi-main-01.svg';

import icon_list from '../../images/ic-view-list.svg';
import icon_goto_white from '../../images/ic-keyboard-arrow-right-white.svg';
import icon_history_back from '../../images/ic-history-black-24-px.svg';
import icon_goto_history from '../../images/ic-keyboard-arrow-right.svg';
import icon_list_disabled from '../../images/ic-view-list-disabled.svg';
import icon_goto_disabled from '../../images/ic-keyboard-arrow-right-disabled.svg';
import icon_history_back_disabled from '../../images/ic-history-black-24-px-white.svg';
import icon_below from '../../images/ic-arrow-down.svg';

import svg_content_01 from '../../images/img-emi-main-02.svg';
import svg_content_02 from '../../images/img-emi-main-03.svg';
import svg_content_03 from '../../images/img-emi-main-04.svg';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {serviceStat: {isOpen: true}, userStat: {
      isEligible: false,
      availableLoan: false, // 대출 추가로 가능
      receivable: false,    // 미수 존재
    }};
    this.notifications = {
      eligible: {
        icon: '🎉',
        text: 'Congratulations!<br/>You are eligible for Easy Pay Plan'
      },
      receivable: {
        icon: '😱',
        text: 'Oops! Please pay your<br/>previous installment first'
      },
      closed: {
        icon: '😅',
        text: 'Sorry, we’re out of stock now<br/>Please come back later'
      }
    };
  }

  componentDidMount() {
    const state = {};
    if (window.$isSelling === false) {
      state.serviceStat = {isOpen: {$set: false}};
    }
    if (window.$eligible) {
      state.userStat = {
        availableLoan: {$set: window.$eligible.restLoanCount > 0},
        receivable: {$set: window.$eligible.loanAvailable === false},
        isAgreed: {$set: window.$eligible.loanAgreement === true}
      };
    }
      // 화면 처리 때문에 시간차 적용
      setTimeout(() => {
        this.setState(update(this.state, {userStat: {
          isEligible: {$set: true},
        }}));
      }, 300);
    // }

    if (Object.keys(state).length) {
      this.setState(update(this.state, state));
    }
  }

  notifyTop(key) {
    let type = this.state.userStat.receivable ? 'receivable' : 'eligible';
    if (!this.state.serviceStat.isOpen) {
      type = 'closed';
    }
    return this.notifications[type][key];
  }

  onClickPlan(ev) {
    let msg = null;

    if (!this.state.userStat.isEligible || this.state.userStat.receivable) {
      msg = `Sorry, you can't avail Easy Pay Plan.`;
    } else if (!this.state.userStat.isAgreed) {
      msg = 'OPEN_T&C';
    }

    if (!this.state.serviceStat.isOpen) {
      msg = 'Sorry, no plan is available yet.';
    }

    // console.log(msg);
    try {
      window.truebalance.openPlans(msg);
    } catch (e) {
      alert(`This content is only available in True Balance app.
(${e.message})`);
    }
  }

  onClickHistory(ev) {
    let msg = `Sorry, you can't avail Easy Pay Plan.`;

    if (this.state.userStat.isEligible) {
      msg = null;
    }

    // console.log(msg);
    try {
      window.truebalance.openHistory(msg);
    } catch (e) {
      alert(`This content is only available in True Balance app.
(${e.message})`);
    }
  }

  render() {
    return (
      <div id="emi-main" className={`text-center ${this.state.serviceStat.isOpen ? '' : 'closed-service'}
        ${this.state.userStat.isEligible ? 'eligible' : ''}`}>
        <div className={`banner-top`}>
          <span className="pull-left" role="img" aria-labelledby="banner-label"
            dangerouslySetInnerHTML={{__html: this.notifyTop('icon')}}></span>
          <p id="banner-label"
            dangerouslySetInnerHTML={{__html: this.notifyTop('text')}}></p>
        </div>
        <header>
          <img src={svg_intro} alt=""/>
          <h3>Recharge Now, Pay Later!</h3>
          <p>Pay in 3 Easy Installments,<br/>
Get Auto Cashback &amp; <br/>
Up to 20% extra free points!</p>
          <div className={`container-btn`}>
            <Link to="/portfolio/MobileLoan-plans">
            <button type="button" className="btn btn-block btn-plan"
              //onClick={this.onClickPlan.bind(this)}
              >
              <img src={this.state.serviceStat.isOpen ? icon_list : icon_list_disabled} className="pull-left" alt=""/>
              <label>View Plans</label>
              <img src={this.state.serviceStat.isOpen ? icon_goto_white : icon_goto_disabled} className="pull-right" alt=""/>
            </button>
            </Link>
            <Link to="/portfolio/MobileLoan-history">
            <button type="button" className="btn btn-block btn-history"
              // onClick={this.onClickHistory.bind(this)}
              >
              <img src={this.state.serviceStat.isOpen ? icon_history_back : icon_history_back_disabled} className="pull-left" alt=""/>
              <label>Payment History</label>
              <img src={this.state.serviceStat.isOpen ? icon_goto_history : icon_goto_white} className="pull-right" alt=""/>
            </button>
            </Link>
            <button type="button" className="btn btn-link  btn-below">
              <img src={icon_below} alt=""/>
            </button>
          </div>
        </header>
        <dl>
          <dt>You can buy <strong>‘ UNLIMITED 179 ’</strong><br/>for only ₹60!</dt>
          <dd><img src={svg_content_01} alt=""/></dd>
          <dt>Pay the rest ₹119 later in 2 EMI</dt>
          <dd><img src={svg_content_02} alt=""/></dd>
          <dt>Get Recharge Membership<br/>Cashback too!</dt>
          <dd><img src={svg_content_03} alt=""/></dd>
        </dl>
        <footer className="text-left">
          <h5><strong>Terms &amp; Conditions</strong> and <strong>Privacy Policy</strong></h5>
          <p>- Installments for a purchased plan will be deducted automatically from your Wallet Money on the due date.<br/>
- If an installment is overdue, you would not have an access to the Recharge and Wallet features on your True Balance Application.<br/>
- Recharge Membership Cashback against Easy Pay Plan will be credited to your 'Free Point segment' only when your last payment is credited in True Balance's account. Overdue payments will not be eligible for Cashback.<br/>
- Your Free Points and Wallet Money may be forfeited; if your installment is overdue for a long time.<br/>
- Easy Pay Plan's sale period & charge rates can be changed by True Balance at any given point of time without any prior notice.<br/>
- Customers can buy Easy Pay Plan up to a defined limit, which is prescribed by Company's policy and can be changed at any given point of time without any prior notice.</p>
        </footer>
      </div>
    );
  }
}
