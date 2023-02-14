import React from 'react';
import {ListGroupItem, Row, Col} from 'react-bootstrap';

import {TextField, Toggle} from 'material-ui';
import { FormsyText, FormsyToggle } from 'formsy-material-ui/lib';

export default class Entry extends React.Component {
	constructor(props) {
		super(props);
	}

	handleChange(e, val) {
		let idx = this.props.idx;
		let name = e.target.name;
		let value = val;

		switch (e.target.name) {
			case 'entry_automated':
				value = val ? 'Y' : 'N';
				break;
		}
		this.props.handleChange(idx, name, value);
	}

	render(){
    return(
	    <ListGroupItem>
				<Row>
					<Col sm={6}>
						<Row>
							<Col xs={6} sm={7} md={8}>지표번호: {this.props.entry_no}</Col>
							<Col xs={6} sm={5} md={4}>
								<FormsyToggle label="계산 자동화" name="entry_automated"
									defaultToggled={this.props.entry_automated == 'Y'}
									onToggle={this.handleChange.bind(this)}/>
							</Col>
							<Col sm={12} lg={4}>
								<FormsyText floatingLabelText="지표 명칭" name="entry_title"
									fullWidth={true} defaultValue={this.props.entry_title}
									onChange={this.handleChange.bind(this)} required
									maxLength="70" pattern="^.{3,}$"
									validations="minLength:3"
									validationError="최소한 3자 이상으로 작성해주세요."/>
							</Col>
							<Col sm={4} lg={3}>
								<FormsyText floatingLabelText="입력 최소값"
									name="entry_input_min"
									fullWidth={true} defaultValue={this.props.entry_input_min}
									onChange={this.handleChange.bind(this)} required
									maxLength="10" pattern="^\d+$"
									validations={{matchRegexp: /^\d+$/}}
									validationError="양의 정수만 입력해주세요."/>
							</Col>
							<Col sm={4} lg={3}>
								<FormsyText floatingLabelText="입력 최대값"
									name="entry_input_max"
									fullWidth={true} defaultValue={this.props.entry_input_max}
									onChange={this.handleChange.bind(this)} required
									maxLength="10" pattern="^\d+$"
									validations={{matchRegexp: /^\d+$/}}
									validationError="양의 정수만 입력해주세요."/>
							</Col>
							<Col sm={4} lg={2}>
								<FormsyText floatingLabelText="가중치"
									name="entry_weight"
									fullWidth={true} defaultValue={parseFloat(this.props.entry_weight)}
									onChange={this.handleChange.bind(this)} required
									maxLength="10" pattern="^-?[0-9]\d*(\.\d+)?$"
									validations="isNumeric"
									validationError="숫자만 입력해주세요." />
							</Col>
						</Row>
					</Col>
					<Col sm={6}>
						<FormsyText floatingLabelText="계산 방법 (범례)" name="entry_calc_legend"
							multiLine={true} fullWidth={true} rowsMax={10}
							defaultValue={this.props.entry_calc_legend}
							onChange={this.handleChange.bind(this)}/>
					</Col>
				</Row>
	    </ListGroupItem>
		);
	}
}
