import '../main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import axios from 'axios';
import WindowResizeListener from 'window-resize-listener-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Snackbar, RaisedButton, Paper, Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui';
import {DropDownMenu, MenuItem} from 'material-ui';
// import 'react-data-grid/dist/react-data-grid.css';

import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.min.css';
// import mockPeriods from 'json!./mockups/scores-initial.json';


let changesImported = {};
const changedCellRenderer = function (instance, td, row, col, prop, value, cellProperties) {
	Handsontable.renderers.NumericRenderer.apply(this, arguments);

	try {
		if (changesImported[row] && changesImported[row][prop]) {
			td.style.backgroundColor = '#2196F3';
			td.style.color = '#fff';
		}
	} catch (error) {
		console.error(error);
	}
};
const countTargets = ['count_deals',
	'count_customers',
	'count_reviewers',
	'count_schedules_1',
	'count_schedules_2',
	'count_schedules_3',
	'count_repurchases',
	'rate_repurchase'];

export default class Scores2 extends React.Component {
	constructor(props) {
		super(props);
		this.urlPrefix = (window.location.host === 'localhost:7777' ? 'http://localhost' : '')
		 + window.location.pathname;

		let digitRegexp = /^\d*$/;
		this.state = {
			period: null, authority: false, isDraft: false, updated: null,
			snackbar: {open: false, message: ''}, canSave: false, canImport: false,
			toolbarHeight: 0, periods: [], levels: [], changes: [],
			options: {
				rowHeaders: true, currentRowClassName: 'current-row', className: 'htRight',
				width: '100%', height: '100%', fixedColumnsLeft: 2,
				colHeaders: ['돌보미', '등급', '거래', '거래고객', '리뷰고객',
					'스케줄<br>(이전달)', '스케줄<br>(이번달)', '스케줄<br>(다음달)', '재구매', '재구매율',
					'사전만남', '교육참석', '교육개최', '돌봄일지', '돌봄일지<br>작성률', '개인마케팅', '포기',

					'고객리뷰 작성률', '스케쥴관리', '재구매율', '사전만남 진행',
					'교육참여율', '돌봄일지 작성', '개인마케팅 활동여부', '돌봄 중도포기율',
					'교정치', '변환총점'],
				columns: [{data: 'sitter', readOnly: true, className: 'htLeft menu-callable'},
					{data: 'level_title', readOnly: true, className: 'htCenter'},
					{data: 'count_deals', type: 'numeric', readOnly: true},
					{data: 'count_customers', type: 'numeric', readOnly: true},
					{data: 'count_reviewers', type: 'numeric', readOnly: true},
					{data: 'count_schedules_1', type: 'numeric', readOnly: true},
					{data: 'count_schedules_2', type: 'numeric', readOnly: true},
					{data: 'count_schedules_3', type: 'numeric', readOnly: true},
					{data: 'count_repurchases', type: 'numeric', readOnly: true},
					{data: 'rate_repurchase', type: 'numeric', format: '0%', readOnly: true},
					{data: 'count_advance_meetings', type: 'numeric', readOnly: true,
						validator: digitRegexp, allowInvalid: false},
					{data: 'count_edu_attendance', type: 'numeric', readOnly: true,
						validator: digitRegexp, allowInvalid: false},
					{data: 'count_edu', type: 'numeric', readOnly: true,
						validator: digitRegexp, allowInvalid: false},
					{data: 'count_care_journals', type: 'numeric', readOnly: true,
						validator: digitRegexp, allowInvalid: false},
					{data: 'rate_care_journal_write', type: 'numeric', format: '0%', readOnly: true},
					{data: 'count_personal_pr', type: 'autocomplete', readOnly: true,
						source: ['', 0, 1], strict: true, validator: /^[01]?$/, allowInvalid: false},
					{data: 'count_abandonments', type: 'numeric', readOnly: true,
						validator: digitRegexp, allowInvalid: false},
					{data: 'score_1', type: 'numeric', readOnly: true},
					{data: 'score_2', type: 'numeric', readOnly: true},
					{data: 'score_3', type: 'numeric', readOnly: true},
					{data: 'score_4', type: 'numeric', readOnly: true},
					{data: 'score_5', type: 'numeric', readOnly: true},
					{data: 'score_6', type: 'numeric', readOnly: true},
					{data: 'score_7', type: 'numeric', readOnly: true},
					{data: 'score_8', type: 'numeric', readOnly: true},
					{data: 'revisionary_score', type: 'numeric', format: '0.0',
						validator: /^-?\d{0,2}(?:\.\d?)?$/, allowInvalid: false},
					{data: 'weighted_total', type: 'numeric', format: '0.0', readOnly: true}],
				afterChange: (changes, source) => {
					if (source !== 'loadData') {
					 	let data = this.state.data;
						let rows = [];
						let arr = [];
						for (let idx in changes) {
							let change = changes[idx];

							if (typeof change[2] === 'string') {
								change[2] = change[2].trim() === '' ? null : change[2];
							}
							if (typeof change[3] === 'string') {
								change[3] = change[3].trim() === '' ? null : change[3];
							}

							if (change[2] !== change[3]) {
								data[change[0]][change[1]] = change[3];

								if (rows.indexOf(change[0]) < 0) {
									rows.push(change[0]);
								}
								arr.push(change);
							}
						}

						rows.forEach(row => {
							this.calc(data[row], row);
						});

						if (arr.length) {
							this.setState(update(this.state, {
								changes: {$push: arr},
							}));
							this.refresh_proc(data);
						}
					}
				},
				contextMenu: {
					selector: '.menu-callable',
		      callback: (key, options) => {
		        switch (key) {
							case 'sitter-detail':
			          setTimeout(() => {
									let sitter = this.table.getDataAtRowProp(options.start.row, 'sitter');

									for (var idx in this.state.data) {
										let row = this.state.data[idx];
										if (row.sitter === sitter) {
											window.open('/manage/sitters/' + row.mem_no);
											break;
										}
									}
			          }, 100);
								break;

							case 'import-sitters':
			          setTimeout(() => {
									let arr = this.table.getDataAtProp('sitter')
										.slice(options.start.row, options.end.row + 1);
									let sitters = [];

									for (var idx in this.state.data) {
										let row = this.state.data[idx];
										if (arr.includes(row.sitter)) {
											sitters.push(row.s_mem_email);
										}
									}

									axios.post(this.urlPrefix + '/statistics', {sitters: sitters})
										.then(response => {
											// console.log(response);
											this.import_proc(response.data, true);
									  }).catch(response => {
											axios.get('/mockups/scores-statistics.json')
												.then(response2 => {
													this.import_proc(response2.data, true);
												});
									  });
								}, 100);
								break;
							default:
		        }
		      },
		      items: {
		        'sitter-detail': {
							name: '돌보미 상세 보러가기',
							disabled: () => {
								let coord = this.table.getSelected();
								return coord[0] !== coord[2];
							}
						},
		        'import-sitters': {
							name: '선택한 돌보미만 내부데이터 계수 실행',
							disabled: () => {
								return !this.state.canImport;
							}
						}
		      }
		    }
			}
		};

		for (let idx in this.state.options.columns) {
			let col = this.state.options.columns[idx];

			if (countTargets.includes(col.data)) {
				col.renderer = changedCellRenderer;
			}
		}
	}

	componentDidMount () {
		this.table = new Handsontable(
			ReactDOM.findDOMNode(this.refs.handsontable), this.state.options);
		this.fetchPeriods(true);

		let toolbar = ReactDOM.findDOMNode(this.refs['toolbar']);
		if (toolbar) {
			this.state.toolbarHeight = toolbar.clientHeight;
		}

		axios.get(window.location.pathname + '/check-auth')
			.then(response => {
				// console.log(response);
				this.setState(update(this.state, {'authority':
					{$set: response.data.authority}}));
		  }).catch(response => {
				let mock = {"authority":true};
				this.setState(update(this.state, {'authority':
					{$set: mock.authority}}));
		  });
	}

	fetchPeriods_proc (data) {
		let p = this.state.period ? this.state.period : data[data.length > 1 ? 1 : 0].period_no;

		this.onChangePeriods(null, data.length > 1 ? 1 : 0, p);
		let updated = null;
		for (var idx in data) {
			if (data[idx].period_no === p) {
				updated = data[idx].updated;
				break;
			}
		}

		this.setState(update(this.state, {
			'periods': {$set: data}, 'period': {$set: p},
			'updated': {$set: updated}
		}));
		this.refresh(p);
	}

	fetchPeriods (isInitial) {
		axios.get(this.urlPrefix + '/initial')
			.then(response => {
				// console.log(response);
				this.fetchPeriods_proc(response.data.periods, isInitial);

				if (isInitial) {
					let entries = response.data.entries;
					let cols = this.state.options.colHeaders;
					for (let idx in entries) {
						idx = parseInt(idx, 10);
						entries[idx].entry_weight = Number.parseFloat(entries[idx].entry_weight);

						let col = cols.splice(17 + idx, 1);
						col += '<br>(' + entries[idx].entry_weight + ')';
						cols.splice(17 + idx, 0, col);
					}

					this.setState(update(this.state, {'entries':
						{$set: response.data.entries}}));
					this.table.updateSettings({colHeaders: cols});
				}
		  }).catch(response => {
				axios.get('/mockups/dogmate/scores-initial.json')
					.then(response2 => {
						this.fetchPeriods_proc(response2.data.periods, isInitial);

						if (isInitial) {
							let entries = response2.data.entries;
							let cols = this.state.options.colHeaders;
							for (let idx in entries) {
								idx = parseInt(idx, 10);
								entries[idx].entry_weight = Number.parseFloat(entries[idx].entry_weight);

								let col = cols.splice(17 + idx, 1);
								col += '<br>(' + entries[idx].entry_weight + ')';
								cols.splice(17 + idx, 0, col);
							}

							this.setState(update(this.state, {'entries':
								{$set: response2.data.entries}}));
							this.table.updateSettings({colHeaders: cols});
						}
					});
				// let mock = [{"period_no":"1","published":null,"created":"2017-01-06 14:58:32","updated":null}];

		  });
	}

	refresh_proc (data) {
		this.setState({data: data});
		this.table.loadData(data);
	}

	refresh (period) {
		axios.get(this.urlPrefix + '/fetch', {params: {period: period}})
			.then(response => {
				// console.log(response);
				for (let idx in response.data) {
					this.calc(response.data[idx], idx);

					if (!response.data[idx].level_title) {
						response.data[idx].level_title = '미지정';
					}
				}

				changesImported = {};
				this.setState(update(this.state, {changes: {$set: []}}));
				this.refresh_proc(response.data);
		  }).catch(response => {
				axios.get('/mockups/dogmate/scores-fetch-1.json')
					.then(response2 => {
						for (let idx in response2.data) {
							this.calc(response2.data[idx], idx);

							if (!response2.data[idx].level_title) {
								response2.data[idx].level_title = '미지정';
							}
						}

						changesImported = {};
						this.setState(update(this.state, {changes: {$set: []}}));
						this.refresh_proc(response2.data);
					});
		  });
	}


	apply_change (target, neo, key, changes, idx) {
		changes.push([parseInt(idx, 10), key, target[key], neo[key]]);
		target[key] = neo[key];
	}

	import_proc (data, canImport) {
		let original = this.state.data;
		let changes = [];

		if (!canImport) {
			changesImported = {};
		}

		for (let idx in original) {
			let sitter = original[idx];

			for (let i in data) {
				let stat = data[i];

				if (sitter.s_mem_email === stat.s_mem_email) {
					countTargets.forEach((key, j) => {
						if (key === 'rate_repurchase') {
							sitter[key] = Number.parseFloat(sitter[key]);
							stat[key] = Number.parseFloat(stat[key]);
						}

						if (!changesImported[idx]) {
							changesImported[idx] = {};
						}
						changesImported[idx][key] = sitter[key] !== stat[key];

						this.apply_change(sitter, stat, key, changes, idx);
					});

					// this.apply_change(sitter, stat, 'count_deals', changes, idx);
					// this.apply_change(sitter, stat, 'count_customers', changes, idx);
					// this.apply_change(sitter, stat, 'count_reviewers', changes, idx);
					// this.apply_change(sitter, stat, 'count_schedules_1', changes, idx);
					// this.apply_change(sitter, stat, 'count_schedules_2', changes, idx);
					// this.apply_change(sitter, stat, 'count_schedules_3', changes, idx);
					// this.apply_change(sitter, stat, 'count_repurchases', changes, idx);
					// this.apply_change(sitter, stat, 'rate_repurchase', changes, idx);

					this.calc(sitter, idx);
					break;
				}
			}
		}
		this.refresh_proc(original);
		this.setState(update(this.state, {
			'canImport': {$set: !!canImport}, 'changes': {$push: changes}
		}));
		this.show_snackbar('내부데이터 잘 가져왔어요-');
	}

	calc (row, idxRow) {
		let entries = this.state.entries;
		let total = 0;

		let changes = [];
		let seq = 0;
		let val = null;

		if (row.count_customers !== null) {
			val = row.count_customers > 0
				? (row.count_reviewers / row.count_customers * 100).toFixed(0) : 0;

			if (val < 30) {
				val = 30;
			}

			this.apply_change(row, {score_1: val}, 'score_1', changes, idxRow);

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		}

		let schedules = [];
		if (!isNaN(parseInt(row.count_schedules_1, 10))) {
			schedules.push(parseInt(row.count_schedules_1, 10));
		}
		if (!isNaN(parseInt(row.count_schedules_2, 10))) {
			schedules.push(parseInt(row.count_schedules_2, 10));
		}
		if (!isNaN(parseInt(row.count_schedules_3, 10))) {
			schedules.push(parseInt(row.count_schedules_3, 10));
		}
		if (schedules.length) {
			let avgSchedule = schedules.reduce((prev, curr) => prev + curr) / schedules.length;

			val = 30;
			if (avgSchedule >= 25) {
				val = 100;
			} else if (avgSchedule >= 24) {
				val = 90;
			} else if (avgSchedule >= 23) {
				val = 80;
			} else if (avgSchedule >= 22) {
				val = 70;
			} else if (avgSchedule >= 21) {
				val = 60;
			} else if (avgSchedule >= 20) {
				val = 50;
			} else if (avgSchedule >= 19) {
				val = 40;
			}
			this.apply_change(row, {score_2: val}, 'score_2', changes, idxRow);

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		}

		if (row.rate_repurchase !== null) {
			val = 100;
			if (row.rate_repurchase < 0.2) {
				val = 30;
			} else if (row.rate_repurchase < 0.4) {
				val = 50;
			} else if (row.rate_repurchase < 0.6) {
				val = 70;
			} else if (row.rate_repurchase < 0.8) {
				val = 90;
			}
			this.apply_change(row, {score_3: val}, 'score_3', changes, idxRow);

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		}

		let countAdvanceMeetings = parseInt(row.count_advance_meetings, 10);
		if (!isNaN(countAdvanceMeetings) && row.count_customers !== null) {
			val = row.count_customers > 0
				? (countAdvanceMeetings / row.count_customers * 100).toFixed(0) : 0;

			if (val < 30) {
				val = 30;
			}

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		} else {
			val = null;
		}
		this.apply_change(row, {score_4: val}, 'score_4', changes, idxRow);

		let countEduAttendance = parseInt(row.count_edu_attendance, 10);
		let countEdu = parseInt(row.count_edu, 10);
		if (!isNaN(countEduAttendance) && !isNaN(countEdu)) {
			val = countEdu > 0
				? (countEduAttendance / countEdu * 100).toFixed(0) : 0;

			if (val < 30) {
				val = 30;
			}

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		} else {
			val = null;
		}
		this.apply_change(row, {score_5: val}, 'score_5', changes, idxRow);

		let countCareJournals = parseInt(row.count_care_journals, 10);
		let rateCareJournalWrite = null;
		if (!isNaN(countCareJournals) && row.count_deals !== null) {
			rateCareJournalWrite = row.count_deals > 0
				? Number.parseFloat((countCareJournals / row.count_deals).toFixed(2)) : 0;

			val = 100;
			if (rateCareJournalWrite < 0.9) {
				val = 30;
			} else if (rateCareJournalWrite < 1) {
				val = 50;
			}

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		} else {
			val = null;
		}
		this.apply_change(row, {rate_care_journal_write: rateCareJournalWrite},
			'rate_care_journal_write', changes, idxRow);
		this.apply_change(row, {score_6: val}, 'score_6', changes, idxRow);

		let countPersonalPR = parseInt(row.count_personal_pr, 10);
		if (!isNaN(countPersonalPR)) {
			val = countPersonalPR ? 100 : 80;

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		} else {
			val = null;
		}
		this.apply_change(row, {score_7: val}, 'score_7', changes, idxRow);

		let countAbandonments = parseInt(row.count_abandonments, 10);
		if (!isNaN(countAbandonments) && row.count_deals !== null) {
			val = row.count_deals > 0
				? (countAbandonments / row.count_deals * 100).toFixed(0) : 0;

			total += Number.parseFloat((val * entries[seq++].entry_weight).toFixed(1));
		} else {
			val = null;
		}
		this.apply_change(row, {score_8: val}, 'score_8', changes, idxRow);

		let revisionaryScore = Number.parseFloat(Number.parseFloat(row.revisionary_score).toFixed(1));

		row.weighted_total = total + (revisionaryScore ? revisionaryScore : 0);

		this.setState(update(this.state, {'changes': {$push: changes}}));
	}


	onChangePeriods (event, index, value) {
		if (this.state.period !== value && (!this.state.changes.length
			|| window.confirm('변경하고 저장하지 않은 내용이 있습니다.\n\n이를 무시하고 선택하신 버전을 불러올까요?'))) {
			let cols = this.state.options.columns;
			let isDraft = false;
			switch (index) {
				case 0:
					isDraft = true;
				case 1:
					for (let idx in cols) {
						switch (cols[idx].data) {
							// case 'count_schedules_1':
							// case 'count_schedules_2':
							case 'count_advance_meetings':
							case 'count_edu_attendance':
							case 'count_edu':
							case 'count_care_journals':
							case 'count_personal_pr':
							case 'count_abandonments':
								cols[idx].readOnly = !!index;
								break;
							case 'revisionary_score':
								cols[idx].readOnly = false;
								break;
							default:
						}
					}
					break;
				default:
					for (let idx in cols) {
						switch (cols[idx].data) {
							case 'count_schedules_1':
							case 'count_schedules_2':
							case 'count_advance_meetings':
							case 'count_edu_attendance':
							case 'count_edu':
							case 'count_care_journals':
							case 'count_personal_pr':
							case 'count_abandonments':
							case 'revisionary_score':
								cols[idx].readOnly = true;
								break;
							default:
						}
					}
			}

			let updated = this.state.updated;
			for (let idx in this.state.periods) {
				let period = this.state.periods[idx];
				if (value === period.period_no) {
					updated = period.updated;
				}
			}

			this.table.updateSettings({columns: cols});
			this.setState(update(this.state, {
				'options': {columns: {$set: cols}},
				'period': {$set: value}, 'updated': {$set: updated},
				'isDraft': {$set: isDraft}, 'canImport': {$set: isDraft}
			}));
			this.refresh(value);
		}
	}

	validateForPublish () {
		let pass = true;

		for (var row in this.state.data) {
			for (var col in this.state.data[row]) {
				var val = this.state.data[row][col];
				if (val === null || (typeof val === 'string' && !val.trim())) {
					pass = false;
					break;
				}
			}
			if (!pass) {
				break;
			}
		}
		return pass;
	}

	show_snackbar (msg) {
		this.setState(update(this.state, {'snackbar': {
			open: {$set: true}, message: {$set: msg}
		}}));
	}


	render(){
    return(
  		<MuiThemeProvider>
				<div style={{height: '100%', paddingBottom: 20}}>
					<WindowResizeListener onResize={windowSize => {
						let container = ReactDOM.findDOMNode(this.refs['containerTable']);
						if (container) {
							this.table.updateSettings({
								height: container.clientHeight - this.state.toolbarHeight
							});
						}
					}}/>
				<Paper style={{height: '100%'}}>
						<Toolbar ref="toolbar">
							<ToolbarGroup firstChild={true}>
          			<ToolbarTitle text="돌보미 평가" style={{marginLeft: 20}} />
								<DropDownMenu value={this.state.period} onChange={this.onChangePeriods.bind(this)}
									className="dropdown-on-toolbar">
									{this.state.periods.map((period, i) => {
										let txt = i < 2 ? (!i ? '다음 배포 대상 (Draft)' : '현재 배포 중')
											: period.published + '에 배포';
										return (
											<MenuItem key={'item-' + i} value={period.period_no}
												primaryText={txt} />
										);
									})}
								</DropDownMenu>
								{'최근 변경: ' + (this.state.updated ? this.state.updated : '저장한 적 없음')}
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<RaisedButton label="내부데이터 계수 실행"
									style={{display: this.state.authority ? 'inline-block' : 'none'}}
									disabled={!this.state.canImport} onClick={() => {

									axios.get(this.urlPrefix + '/statistics')
										.then(response => {
											// console.log(response);
											this.import_proc(response.data);
									  }).catch(response => {
											axios.get('/mockups/dogmate/scores-statistics.json')
												.then(response2 => {
													this.import_proc(response2.data);
												});
									  });
									}}/>
								<RaisedButton label="저장 및 마감" secondary={true}
									style={{display: this.state.authority ? 'inline-block' : 'none'}}
									disabled={!this.state.isDraft} onClick={() => {
										if (this.validateForPublish()) {
											axios.post(this.urlPrefix + '/finish-period', {data: this.state.data,
												changes: this.state.changes, period: this.state.period})
												.then(response => {
													// console.log(response);
													this.show_snackbar('마감 성공~');
													window.location.reload();
												}).catch(response => {
													console.error(response);
													this.show_snackbar('마감하면서 뭔가 오류가 생겼어요. 담당 개발자에게 문의해주세요-');
												});
										} else {
											this.show_snackbar('마감하려면 모든 데이터를 입력하여 점수가 산출돼야 합니다. 확인해주세요~');
										}
									}}/>
								<RaisedButton label="저장" primary={true} onClick={() => {
									axios.post(this.urlPrefix + '/save', {data: this.state.data,
										changes: this.state.changes, period: this.state.period})
										.then(response => {
											// console.log(response);
											this.refresh(this.state.period);
											this.show_snackbar('잘 저장했어요~');
										}).catch(response => {
											console.error(response);
											this.show_snackbar('저장하면서 뭔가 오류가 생겼어요. 담당 개발자에게 문의해주세요-');
										});
									}} disabled={!this.state.changes.length}/>
							</ToolbarGroup>
						</Toolbar>
						<div ref="containerTable" style={{
								height: '100%', paddingTop: this.state.toolbarHeight,
								marginTop: -this.state.toolbarHeight
							}}><div ref="handsontable" style={{
									height: '100%', overflow: 'auto'
								}}></div></div>
					</Paper>

					<Snackbar open={this.state.snackbar.open}
	          message={this.state.snackbar.message}
	          autoHideDuration={5000} className="snackbar"
	          onRequestClose={() => {
							this.setState(update(this.state, {'snackbar': {
								open: {$set: false}
							}}));
						}}/>
				</div>
			</MuiThemeProvider>
		);
	}
}
