import '../main.css';

import React from 'react';
import { connect } from 'react-redux';
import update from 'react-addons-update';
import axios from 'axios';
import * as actions from './actions';

import {Panel, Button, ListGroupItem} from 'react-bootstrap';
import {ListGroup} from 'react-bootstrap';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Snackbar} from 'material-ui';
import Formsy from 'formsy-react';

import Entry from './Entry';

class ScoreEntries extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: {open: false, message: ''}, canSave: false
		};
	}

	componentDidMount () {
		axios.get(window.location.pathname + '/fetch')
			.then(this._refresh.bind(this))
			.catch(response => {
				console.error('!!! ', response);

				let entries = [{"entry_no":"1","entry_title":"\uace0\uac1d\ub9ac\ubdf0\uc791\uc131\ub960","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.020","entry_calc_legend":"\ub9ac\ubdf0\uc791\uc131\ud55c \uace0\uac1d\uc218 \/ \uac70\ub798 \uace0\uac1d\uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 16:48:38","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"2","entry_title":"\uc2a4\ucf00\uc974\uad00\ub9ac","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"\ucd5c\uadfc 3\uac1c\uc6d4(n-1, n, n+1)\uc758 \ub3cc\ubd04\uac00\ub2a5 \uc2a4\ucf00\uc974 \uc6d4\ud3c9\uade0\n\n18\uc77c \uc774\ud558 : 30\n19\uc77c : 40\n20\uc77c : 50\n21\uc77c : 60\n22\uc77c : 70\n23\uc77c : 80\n24\uc77c : 90\n25\uc77c \uc774\uc0c1 : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:15:52","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"3","entry_title":"\uc7ac\uad6c\ub9e4\uc728","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"\uc7ac\uad6c\ub9e4\uac74\uc218 \/ \uc804\uccb4 \uac70\ub798\uac74\uc218\n\n20% \ubbf8\ub9cc : 30\n20%~39% : 50\n40%~59% : 70\n60%~79% : 90\n80%~100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:21:31","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"4","entry_title":"\uc0ac\uc804\ub9cc\ub0a8 \uc9c4\ud589","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.020","entry_calc_legend":"\uc0ac\uc804\ub9cc\ub0a8 \uc9c4\ud589\uac74\uc218 \/ \uac70\ub798 \uace0\uac1d\uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:21:31","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"5","entry_title":"\uad50\uc721\ucc38\uc5ec\uc728","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.020","entry_calc_legend":"\ucc38\uc5ec\ud69f\uc218 \/ \uc804\uccb4 \uad50\uc721 \uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:21:31","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"6","entry_title":"\ub3cc\ubd04\uc77c\uc9c0 \uc791\uc131","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"\ub3cc\ubd04\uc77c\uc9c0 \ub4f1\ub85d\ud69f\uc218 \/ \uc804\uccb4 \uac70\ub798\uac74\uc218\n\n89% \uc774\ud558 : 30\n90% \ub300 : 50\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:29:25","updated":null,"updater":"ian"},{"entry_no":"7","entry_title":"\uac1c\uc778\ub9c8\ucf00\ud305 \ud65c\ub3d9\uc5ec\ubd80","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"No : 30\nYes : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:29:25","updated":"2016-11-30 18:08:56","updater":"ian"},{"entry_no":"8","entry_title":"\ub3cc\ubd04 \uc911\ub3c4\ud3ec\uae30\uc728","entry_input_min":"0","entry_input_max":"100","entry_weight":"-0.030","entry_calc_legend":"\ud3ec\uae30\uac74\uc218 \/ \uac70\ub798\uac74\uc218\n\n\ud3ec\uae30\uc728 \uc808\ub300\uac12(100%\uc778 \uacbd\uc6b0, 100)","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:29:25","updated":"2016-11-30 17:59:17","updater":"ian"}];
				this._refresh({data: entries});
			});
	}

	_refresh (response) {
		//console.info(response);
		this.props.refresh(response.data);

		this.setState(update(this.state, {['canSave']: {$set: false}}));
	}

	submit(e) {
		let list = this.props.list.filter((entry, i) => {
			if (entry.changed) {
				return entry;
			}
		});
		if (list.length) {
			axios.post(window.location.pathname + '/submit', list)
				.then(this._refresh.bind(this))
				.catch(response => { console.error(response); });
		} else {
			update(this.state, {['snackbar']: {
				open: {$set: true},
				message: {$set: '변경된 내용이 없어 저장하지 않습니다.'}
			}})
		}
		//location.reload();
	}

	onChangeEntry (idx, name, val) {
		this.props.changeEntry({idx: idx, name: name, value: val});
		//console.log(idx, name, val);
		this.setState(update(this.state, {['canSave']: {$set: true}}));
	}

	render(){
    return(
  		<MuiThemeProvider>
				<Formsy.Form onValidSubmit={this.submit.bind(this)}
					onInvalidSubmit={(model, resetForm, invalidateForm) => {
						// console.log('onInvalidSubmit: ', model);
						this.setState(update(this.state, {['snackbar']: {
							open: {$set: true},
							message: {$set: '형식에 맞지 않는 값이 있어, 저장할 수 없습니다.'}
						}}));
					}}>
					<Panel header={<h4>돌보미 평가지표</h4>}
						footer={<div><Button
							onClick={this.props.newEntry}>신규 항목</Button>{' '}
							<Button bsStyle="info" type="submit"
								disabled={!this.state.canSave} ref="btnSave">저장</Button></div>}>
						<ListGroup fill>
							{this.props.list.map((entry, i) => {
								var prop = {
									key: i, idx: i,
									handleChange: this.onChangeEntry.bind(this)
								};
								for (var idx in entry) {
									prop[idx] = entry[idx];
								}
								return React.createElement(Entry, prop, null);
							})}
						</ListGroup>
					</Panel>

					<Snackbar open={this.state.snackbar.open}
	          message={this.state.snackbar.message}
	          autoHideDuration={5000}
	          onRequestClose={() => {
							this.setState(update(this.state, {['snackbar']: {
								open: {$set: false}
							}}));
						}}/>
				</Formsy.Form>
			</MuiThemeProvider>
		);
	}
}

export default connect((state) => {
  return {
    list: state.entry
  };
}
, (dispatch) => {
	return {
		newEntry: () => {dispatch(actions.newEntry())},
		refresh: (list) => {dispatch(actions.refresh(list))},
		changeEntry: (change) => {dispatch(actions.changeEntry(change))},
		save: (list) => {

		}
	}
}
)(ScoreEntries);
