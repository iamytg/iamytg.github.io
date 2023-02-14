import React, { Component } from 'react';
import update from 'react-addons-update';
import {HashRouter as Router, Route, NavLink as RouterNavLink} from 'react-router-dom';
import {Navbar, NavLink, NavbarToggler, NavbarNav, NavItem, Collapse}
  from 'mdbreact';
import FontAwesome from '@fortawesome/react-fontawesome';
import { faGithub, faFacebook, faTwitter, faInstagram, faLinkedin }
  from '@fortawesome/fontawesome-free-brands';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdbreact/dist/css/mdb.css';
import './App.css';

import LocationListener from './components/location-listener';
import Home from './components/Home';
import Devlogs from './components/Devlogs';

import HowtoCreateGithubUserPage from './articles/HowtoCreateGithubUserPage';
import D3Bubblechart from './articles/d3-bubblechart/App';

import MobileLoan_tandc from './portfolio/truebalance/emi/src/TAndC';
import MobileLoan_history from './portfolio/truebalance/emi/src/History';
import MobileLoan_plans from './portfolio/truebalance/emi/src/Plans';
import MobileLoan_landing from './portfolio/truebalance/emi/src/Main';

import CMS_instructions from './portfolio/truebalance/cms/Instructions';
import CMS_luckygames_detail from './portfolio/truebalance/cms/Luckygames_detail';
import CMS_luckygames_list from './portfolio/truebalance/cms/Luckygames_list';
import CMS_gem from './portfolio/truebalance/cms/UserGemPoint_index';

import Dog_issuingCoupons from './portfolio/dogmate/IssuingCoupons';
import Dog_Scores from './portfolio/dogmate/score/Scores';
import Dog_Scores2 from './portfolio/dogmate/score/Scores2';
import Dog_SitterScores from './portfolio/dogmate/score/SitterScores';
import Dog_SitterSearchOrder from './portfolio/dogmate/score/SitterSearchOrder';


export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {collapse: true, navForcedBGOpacity: false,
      pathname: ''};
  }

  collapseNavbarToggler = (isCollapse) => {
    if (isCollapse === undefined) {
      this.processCollapse(isCollapse);
    } else {
      setTimeout(() => {
        this.processCollapse(isCollapse);
      }, 50);
    }
  }
  processCollapse = (isCollapse) => {
    this.setState(update(this.state, {collapse:
      {$set: isCollapse === undefined ? !this.state.collapse : isCollapse}}));
  }

  updatePathname = (pathname) => {
    this.setState(update(this.state, {
      navForcedBGOpacity: {$set: pathname !== '/'},
      pathname: {$set: pathname}
    }));
  }

  isInDevlogs = () => {
    let pathname = this.state.pathname;
    return pathname != null && (
      pathname.indexOf('/devlogs') === 0
      || pathname.indexOf('/articles') === 0
      || pathname.indexOf('/portfolio') === 0
    );
  }

  render() {
    return (
      <Router className="container">
        <LocationListener updatePathname={this.updatePathname}>
          <Navbar dark expand="md" fixed="top" scrolling
            className={this.state.navForcedBGOpacity ? 'top-nav-opacity' : ''}>
            <RouterNavLink className="navbar-brand" to="/" onClick={() => {
              this.collapseNavbarToggler(true);
            }}>Yang Taegyu</RouterNavLink>
            <NavbarToggler onClick={() => {
              this.collapseNavbarToggler();
            }}/>
            <Collapse isOpen={!this.state.collapse} navbar>
              <NavbarNav left>
                <NavItem active={this.isInDevlogs()}>
                  <NavLink className="nav-link" onClick={() => {
                    this.collapseNavbarToggler(true);
                  }}
                    to="/devlogs">Devlogs</NavLink>
                </NavItem>
                <NavItem>
                  <a className="nav-link" href="https://www.linkedin.com/in/iam-ytg"
                    target="_blank" rel="noopener noreferrer">Profile</a>
                </NavItem>
              </NavbarNav>
              <NavbarNav right>
                <NavItem>
                  <a className="nav-link" href="https://github.com/iamytg"
                    target="_blank" rel="noopener noreferrer">
                    <FontAwesome icon={faGithub} />
                  </a>
                </NavItem>
                <NavItem>
                  <a className="nav-link" href="https://www.linkedin.com/in/iam-ytg"
                    target="_blank" rel="noopener noreferrer">
                    <FontAwesome icon={faLinkedin} />
                  </a>
                </NavItem>
                <NavItem>
                  <a className="nav-link" href="https://facebook.com/iamytg"
                    target="_blank" rel="noopener noreferrer">
                    <FontAwesome icon={faFacebook} />
                  </a>
                </NavItem>
                <NavItem>
                  <a className="nav-link" href="https://twitter.com/iamytg"
                    target="_blank" rel="noopener noreferrer">
                    <FontAwesome icon={faTwitter} />
                  </a>
                </NavItem>
                <NavItem>
                  <a className="nav-link" href="https://instagram.com/iam.ytg"
                    target="_blank" rel="noopener noreferrer">
                    <FontAwesome icon={faInstagram} />
                  </a>
                </NavItem>
              </NavbarNav>
            </Collapse>
          </Navbar>
          <div className={`main-container${this.state.pathname.length < 2 ? ' d-none' : ''}`}>
            <main className="container">
              <Route exact path="/devlogs" component={Devlogs}/>
              <Route exact path="/articles/HowtoCreateGithubUserPage" component={HowtoCreateGithubUserPage}/>
              <Route exact path="/fork/d3-bubblechart" component={D3Bubblechart}/>

              <Route exact path="/portfolio/CMS-instructions" component={CMS_instructions}/>
              <Route exact path="/portfolio/CMS-luckygames-detail" component={CMS_luckygames_detail}/>
              <Route exact path="/portfolio/CMS-luckygames-list" component={CMS_luckygames_list}/>
              <Route exact path="/portfolio/CMS-gem" component={CMS_gem}/>

              <Route exact path="/portfolio/Dogsitting-issuingCoupons" component={Dog_issuingCoupons}/>
              <Route exact path="/portfolio/Dogsitting-Scores" component={Dog_Scores}/>
              <Route exact path="/portfolio/Dogsitting-Scores2" component={Dog_Scores2}/>
              <Route exact path="/portfolio/Dogsitting-SitterScores" component={Dog_SitterScores}/>
              <Route exact path="/portfolio/Dogsitting-SitterSearchOrder" component={Dog_SitterSearchOrder}/>
            </main>
            <main className="container-fluid truebalance">
              <Route exact path="/portfolio/MobileLoan-tandc" component={MobileLoan_tandc}/>
              <Route exact path="/portfolio/MobileLoan-history" component={MobileLoan_history}/>
              <Route exact path="/portfolio/MobileLoan-plans" component={MobileLoan_plans}/>
              <Route exact path="/portfolio/MobileLoan-landing" component={MobileLoan_landing}/>

            </main>
          </div>
          <Route exact path="/" component={Home}/>
        </LocationListener>
      </Router>
    );
  }
}
