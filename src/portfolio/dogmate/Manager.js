import React from 'react';
import {Link, IndexLink} from 'react-router';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export default class Manager extends React.Component {
	render(){

		return (
			<div>
					<Navbar>
						<Navbar.Header>
							<Navbar.Brand>
								<IndexLink to="/manage">Dogmate Manager</IndexLink>
							</Navbar.Brand>
						</Navbar.Header>
						<Nav>
							<LinkContainer to="/manage/score-entries">
								<NavItem eventKey={1}>등급제 평가지표 관리</NavItem>
							</LinkContainer>
						</Nav>
					</Navbar>
          <div className="container">
					  {this.props.children}
          </div>
			</div>
		);
	}
}
