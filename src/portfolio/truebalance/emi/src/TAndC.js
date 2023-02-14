// import 'babel-polyfill';
import React, {Component} from 'react';
import axios from 'axios';

import './main.css';

import icon_close from '../../images/ic-close-black-24-px.svg'
import icon_arrow_right from '../../images/ic-arrow-right-orange.svg'

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {};

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

    this.isIdle = {submiting: true};
    this.urlPathPrefix = window.$urlPathPrefix || '';
  }

  componentDidMount() {
  }

  agree = () => {
    if (this.isIdle.submiting) {
      this.isIdle.submiting = false;

      axios.put(`${this.urlPathPrefix}/loan/agent/info`,
        null, {headers: this.headers})
        .then(response => {
          if (response.status === 200) {
            try {
              window.truebalance.openPlans(null);
            } catch (e) {
              alert(`This content is only available in True Balance app.
(${e.message})`);
            }
          } else {
            alert(`The server says it failed.
(${response.statusText})`);
          }
        }).catch(error => {}).then(() => {this.isIdle.submiting = true;});
    }
  }

  render() {
    return (
      <div id="emi-tandc">
        <header>
          <button type="button" onClick={() => {
            try {
              window.truebalance.closeTAndC();
            } catch (e) {
              alert(`This content is only available in True Balance app.
(${e.message})`);
            }
          }}><img src={icon_close} alt="" /></button>
        </header>
        <dl>
          <dt>Please agree to our T&amp;C and Privacy Policy first</dt>
          <dd>- Balancehero (in any case, hereinafter referred to as “We”, “Our”, “Company”) has all rights regarding fundamental technologies and general operations of the system, while an affiliated NBFC will be in charge of the recharge loan service provided to you. <br/>
- Company will deliver your information to the affiliated NBFC for the purpose of performing minimum KYC(Know Your Customer) procedures, which would suffice as NBFC’s own minimum KYC completion.<br/>
- Company can verify your identity through third parties that provide credit inquiry services provided you have expressed consent to Company’s terms and conditions. Company also can request documents to verify identity from you in case your identity cannot be verified through prescribed measures.<br/>
- You will be held responsible for any harm afflicted on you, Company, or anyone else caused from violating these terms and conditions and shall compensate for the harm accordingly without delay.<br/>
- You shall deposit the exact amounts to your Wallet on the dates prescribed at the point of purchase of a plan from Our recharge loan.<br/>
- Your installments will be automatically deducted from your Wallet Money on the dates prescribed at the point of purchase.<br/>
- In case you fail to deposit a required amount, your credit information and use of Our Service can be put at a disadvantage.<br/>
- In case you fail to deposit a required amount on the prescribed payment date, you won’t be able to avail our Recharge service and won’t be able to Send or Transfer Wallet Money to another Wallet or a bank account.<br/>
- Cashback from Recharge Membership for a recharge loan is furnished right after all installments are properly paid. Even 1 overdue payment will disqualify you from acquiring Cashback.<br/>
- In case an overdue payment is not settled for a prolonged time, you may lose access to your True Balance account as well as all of your Free Point and Wallet Money. The length of overdue period qualifying forfeiture of your account is determined by Company and can be changed at any given point of time without any prior notice.<br/>
- Recharge loan’s sale period, charge rates, and the number of times a User can purchase a plan is determined and can be changed by True Balance at any given point of time without any prior notice. <br/>
- In case Company detects a fraudulent use of recharge loan, Company is entitled to discontinue all Services provided to the Users accountable for and involved in such use. Company has the right to decide whether a use has a fraudulent nature.</dd>
        </dl>
        <footer className="text-center">
          <button type="button" onClick={this.agree}>
            <label>Agree &amp; View Plans</label>
            <img src={icon_arrow_right} className="pull-right" alt="" />
          </button>
        </footer>
      </div>
    );
  }
}
