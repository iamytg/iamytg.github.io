import React, {Component} from 'react';
import {Helmet} from "react-helmet";

import FontAwesome from '@fortawesome/react-fontawesome';
import { faEnvelope }
from '@fortawesome/fontawesome-free-regular';

export default class extends Component {
  render() {
    return (
      <div className="home view intro teal darken-1">
        <Helmet>
          <title>Welcome to my devlog</title>
        </Helmet>
        <div className="full-bg-img flex-center">
          <div className="container text-center white-text animated fadeInUp">
            <h2><strong>양태규 Yang Taegyu</strong></h2>
            <br/><br/>
            <ul className="list-unstyled">
              <li>Software Engineer based on full-stack web development</li>
              <li>뼛속까지 공돌이 (Since 1992)</li>
              <li>a Harmonious Christian, Jesus Chaser</li>
              <li>a Husband, a Father</li>
            </ul>
            <br/>
            <ul className="list-unstyled">
              <li>I&rsquo;m looking for work. Please contact me by email below.</li>
              <li><a href="mailto:iamytg@gmail.com" style={{color: '#fff'}}>
                <FontAwesome icon={faEnvelope} /> &nbsp;iamytg@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
