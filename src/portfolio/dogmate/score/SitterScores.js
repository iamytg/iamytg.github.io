import '../main.css';

import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
//injectTapEventPlugin();

import {Snackbar, RadioButtonGroup, RadioButton, RaisedButton} from 'material-ui';
// import 'react-data-grid/dist/react-data-grid.css';

import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.min.css';


export default class SitterScores extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isApproved: 'Y',
			snackbar: {open: false, message: ''}, canSave: false,
			options: {
				rowHeaders: true, currentRowClassName: 'current-row',
				columnSorting: true, sortIndicator: true, className: 'htRight',
				contextMenu: {
		      callback: (key, options) => {
		        switch (key) {
							case 'sitter-detail':
			          setTimeout(() => {
									let sitter = this.table.getDataAtRowProp(options.start.row, 'sitter');

									for (var idx in this.state.options.data) {
										let row = this.state.options.data[idx];
										if (row.sitter === sitter) {
											window.location.href = '/manage/sitters/' + row.mem_no;
											break;
										}
									}
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
						}
		      }
		    }
			}
		};
	}

	componentDidMount () {
		this.table = new Handsontable(
			ReactDOM.findDOMNode(this.refs.handsontable), this.state.options);
		this.refresh(true);
	}

	refresh_proc (isInitial, data) {
		if (isInitial) {
			let entries = data.entries;
			let colHeaders = ['돌보미', '등급'];
			let cols = [
				{data: 'sitter', readOnly: true, className: 'htLeft'},
				{data: 'level_title', readOnly: true, className: 'htCenter'}
			];

			for (var idx in entries) {
				colHeaders.push(entries[idx].entry_title);
				cols.push({data: 'key-' + entries[idx].entry_no, readOnly: true});
			}
			colHeaders.push('변환총점');
			cols.push({data: 'weighted_total', readOnly: true});

			this.setState(update(this.state, {'options': {
				columns: {$set: cols}, colHeaders: {$set: colHeaders},
				data: {$set: data.scores}
			}}));
			this.table.updateSettings(this.state.options);
		} else {
			this.table.loadData(data.scores);

			if (this.table.sortColumn !== undefined) {
				this.table.sort(this.table.sortColumn);
			}
		}
	}

	refresh (isInitial) {
		axios.get(window.location.pathname + '/fetch', {params: {type: this.state.isApproved}})
			.then(response => {
				// console.log(response);
				this.refresh_proc(isInitial, response.data);
		  }).catch(response => {
				let mock = {"entries":[{"entry_no":"1","entry_title":"\uace0\uac1d\ub9ac\ubdf0\uc791\uc131\ub960","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.020","entry_calc_legend":"\ub9ac\ubdf0\uc791\uc131\ud55c \uace0\uac1d\uc218 \/ \uac70\ub798 \uace0\uac1d\uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 16:48:38","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"2","entry_title":"\uc2a4\ucf00\uc974\uad00\ub9ac","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"\ucd5c\uadfc 3\uac1c\uc6d4(n-1, n, n+1)\uc758 \ub3cc\ubd04\uac00\ub2a5 \uc2a4\ucf00\uc974 \uc6d4\ud3c9\uade0\n\n18\uc77c \uc774\ud558 : 30\n19\uc77c : 40\n20\uc77c : 50\n21\uc77c : 60\n22\uc77c : 70\n23\uc77c : 80\n24\uc77c : 90\n25\uc77c \uc774\uc0c1 : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:15:52","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"3","entry_title":"\uc7ac\uad6c\ub9e4\uc728","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"\uc7ac\uad6c\ub9e4\uac74\uc218 \/ \uc804\uccb4 \uac70\ub798\uac74\uc218\n\n20% \ubbf8\ub9cc : 30\n20%~39% : 50\n40%~59% : 70\n60%~79% : 90\n80%~100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:21:31","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"4","entry_title":"\uc0ac\uc804\ub9cc\ub0a8 \uc9c4\ud589","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.020","entry_calc_legend":"\uc0ac\uc804\ub9cc\ub0a8 \uc9c4\ud589\uac74\uc218 \/ \uac70\ub798 \uace0\uac1d\uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:21:31","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"5","entry_title":"\uad50\uc721\ucc38\uc5ec\uc728","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.020","entry_calc_legend":"\ucc38\uc5ec\ud69f\uc218 \/ \uc804\uccb4 \uad50\uc721 \uc218\n\n39% \uc774\ud558 : 30\n40% \ub300 : 40\n50% \ub300 : 50\n60% \ub300 : 60\n70% \ub300 : 70\n80% \ub300 : 80\n90% \ub300 : 90\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:21:31","updated":"2016-11-30 17:29:25","updater":"ian"},{"entry_no":"6","entry_title":"\ub3cc\ubd04\uc77c\uc9c0 \uc791\uc131","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"\ub3cc\ubd04\uc77c\uc9c0 \ub4f1\ub85d\ud69f\uc218 \/ \uc804\uccb4 \uac70\ub798\uac74\uc218\n\n89% \uc774\ud558 : 30\n90% \ub300 : 50\n100% : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:29:25","updated":null,"updater":"ian"},{"entry_no":"7","entry_title":"\uac1c\uc778\ub9c8\ucf00\ud305 \ud65c\ub3d9\uc5ec\ubd80","entry_input_min":"30","entry_input_max":"100","entry_weight":"0.010","entry_calc_legend":"No : 30\nYes : 100","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:29:25","updated":"2016-11-30 18:08:56","updater":"ian"},{"entry_no":"8","entry_title":"\ub3cc\ubd04 \uc911\ub3c4\ud3ec\uae30\uc728","entry_input_min":"0","entry_input_max":"100","entry_weight":"-0.030","entry_calc_legend":"\ud3ec\uae30\uac74\uc218 \/ \uac70\ub798\uac74\uc218\n\n\ud3ec\uae30\uc728 \uc808\ub300\uac12(100%\uc778 \uacbd\uc6b0, 100)","entry_automated":"N","entry_order":"9999","created":"2016-11-30 17:29:25","updated":"2016-11-30 17:59:17","updater":"ian"}],"scores":[{"email":"km8116@nate.com","mem_nm":"\uac15\uacbd\ubbf8","mem_no":"16061423272355362760","sitter":"\uac15\uacbd\ubbf8 (km8116@nate.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"qmfl72@naver.com","mem_nm":"\uae40\ubbfc\uc1a1","mem_no":"1511301052471037934","sitter":"\uae40\ubbfc\uc1a1 (qmfl72@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"bbu0703@naver.com","mem_nm":"\uae40\uc0c1\ud76c","mem_no":"16050912231021512258","sitter":"\uae40\uc0c1\ud76c (bbu0703@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"somin419@naver.com","mem_nm":"\uae40\uc18c\ubbfc","mem_no":"16011620012739393630","sitter":"\uae40\uc18c\ubbfc (somin419@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"romy6308@naver.com","mem_nm":"\uae40\uc18c\ud76c","mem_no":"16011409462287485793","sitter":"\uae40\uc18c\ud76c (romy6308@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"lessonfive@hanmail.net","mem_nm":"\uae40\uc218\ube48","mem_no":"16011114293726117159","sitter":"\uae40\uc218\ube48 (lessonfive@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"kye4526@naver.com","mem_nm":"\uae40\uc608\uc740","mem_no":"16011215300468036396","sitter":"\uae40\uc608\uc740 (kye4526@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"erislove@naver.com","mem_nm":"\uae40\uc720\uc8fc","mem_no":"16020916165028314210","sitter":"\uae40\uc720\uc8fc (erislove@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"keuly0405@naver.com","mem_nm":"\uae40\ud604\uc219","mem_no":"1509241318274834666","sitter":"\uae40\ud604\uc219 (keuly0405@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"dmdk9089@hanmail.net","mem_nm":"\ub9c8\uc544\uc815","mem_no":"16051617221632691160","sitter":"\ub9c8\uc544\uc815 (dmdk9089@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"chfhd9311@naver.com","mem_nm":"\ubc15\ub2e4\ud61c","mem_no":"16030519580813294752","sitter":"\ubc15\ub2e4\ud61c (chfhd9311@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"kornekt@hanmail.net","mem_nm":"\ubc15\uc740\uacbd","mem_no":"16061503412212673979","sitter":"\ubc15\uc740\uacbd (kornekt@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"p11a97@naver.com","mem_nm":"\ubc15\ud61c\uc740","mem_no":"16051017441013698996","sitter":"\ubc15\ud61c\uc740 (p11a97@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"carolyn1221@naver.com","mem_nm":"\ubc31\uaddc\ub9ac","mem_no":"16011121431245732361","sitter":"\ubc31\uaddc\ub9ac (carolyn1221@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"aqaq1122@naver.com","mem_nm":"\ubc31\uc608\uc2ac","mem_no":"16040614344917596682","sitter":"\ubc31\uc608\uc2ac (aqaq1122@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"rlfls4860@naver.com","mem_nm":"\ubc31\uc740\ud61c","mem_no":"16040916045711745029","sitter":"\ubc31\uc740\ud61c (rlfls4860@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"hahabono@hanmail.net","mem_nm":"\uc2e0\uc219\uc815","mem_no":"16041001130594582390","sitter":"\uc2e0\uc219\uc815 (hahabono@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"aja93@naver.com","mem_nm":"\uc548\uc9c0\uc544","mem_no":"16040902142553663188","sitter":"\uc548\uc9c0\uc544 (aja93@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"yhj3428@nate.com","mem_nm":"\uc591\ud61c\uc9c4","mem_no":"16050915584049773388","sitter":"\uc591\ud61c\uc9c4 (yhj3428@nate.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"umji95@naver.com","mem_nm":"\uc5c4\uc9c0\ud604","mem_no":"16011117580912880963","sitter":"\uc5c4\uc9c0\ud604 (umji95@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"naomiogiwara@gmail.com","mem_nm":"\uc624\uae30\uc640\ub77c \ub098\uc624\ubbf8","mem_no":"16051913242218581748","sitter":"\uc624\uae30\uc640\ub77c \ub098\uc624\ubbf8 (naomiogiwara@gmail.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"popwsj@naver.com","mem_nm":"\uc6b0\uc218\uc9c4","mem_no":"16011317354415140310","sitter":"\uc6b0\uc218\uc9c4 (popwsj@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"0109532@naver.com","mem_nm":"\uc6d0\uc18c\uc601","mem_no":"16050515463047083234","sitter":"\uc6d0\uc18c\uc601 (0109532@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"yuyingxi@outlook.com","mem_nm":"\uc720\uc774","mem_no":"16060919463565428938","sitter":"\uc720\uc774 (yuyingxi@outlook.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"egg5340@gmail.com","mem_nm":"\uc720\uc815\ud654","mem_no":"16042215284598314876","sitter":"\uc720\uc815\ud654 (egg5340@gmail.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"2138464@hanmail.net","mem_nm":"\uc774\ubbf8\ub9ac","mem_no":"15122816194656048423","sitter":"\uc774\ubbf8\ub9ac (2138464@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"dltjsghk1233@naver.com","mem_nm":"\uc774\uc120\ud654","mem_no":"16010423240133760491","sitter":"\uc774\uc120\ud654 (dltjsghk1233@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"tndus7894@nate.com","mem_nm":"\uc784\uc218\uc5f0","mem_no":"1604141801006139188","sitter":"\uc784\uc218\uc5f0 (tndus7894@nate.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"luffy6878@naver.com","mem_nm":"\uc784\ud0dc\ud601","mem_no":"16041621224352460927","sitter":"\uc784\ud0dc\ud601 (luffy6878@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"jeewon0517@gmail.com","mem_nm":"\uc7a5\uc9c0\uc6d0","mem_no":"16012718264671123559","sitter":"\uc7a5\uc9c0\uc6d0 (jeewon0517@gmail.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"hyesim88@gmail.com","mem_nm":"\uc804\uc608\ub9bc","mem_no":"15092218030192835867","sitter":"\uc804\uc608\ub9bc (hyesim88@gmail.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"sjd7066@hanmail.net","mem_nm":"\uc804\ud61c\uacbd","mem_no":"16051013144328430467","sitter":"\uc804\ud61c\uacbd (sjd7066@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"bbananar@gmail.com","mem_nm":"\uc815\ub098\ub798","mem_no":"15121713352115274582","sitter":"\uc815\ub098\ub798 (bbananar@gmail.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"jislpo@hanmail.net","mem_nm":"\uc815\uc774\uc218","mem_no":"15111300280077977070","sitter":"\uc815\uc774\uc218 (jislpo@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"parade7@hanmail.net","mem_nm":"\uc815\uc9c0\ud604","mem_no":"16013119221176328540","sitter":"\uc815\uc9c0\ud604 (parade7@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"jhu2850@hanmail.net","mem_nm":"\uc815\ud604\uc6b1","mem_no":"16040100054596995258","sitter":"\uc815\ud604\uc6b1 (jhu2850@hanmail.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"rubbinggg@daum.net","mem_nm":"\uc870\uc740\ubcf4\ub78c","mem_no":"16011504034436255760","sitter":"\uc870\uc740\ubcf4\ub78c (rubbinggg@daum.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"chsgds@naver.com","mem_nm":"\uc870\ud6a8\uc131","mem_no":"16030411362652551419","sitter":"\uc870\ud6a8\uc131 (chsgds@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"cute_kyoung@naver.com","mem_nm":"\ucd5c\ub098\uacbd","mem_no":"16030109093068034210","sitter":"\ucd5c\ub098\uacbd (cute_kyoung@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"etoile.cmj@gmail.com","mem_nm":"\ucd5c\uba85\uc9c4","mem_no":"16030700490561968022","sitter":"\ucd5c\uba85\uc9c4 (etoile.cmj@gmail.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"yeahagod87@naver.com","mem_nm":"\ucd5c\uc138\ud604","mem_no":"16012217483394465188","sitter":"\ucd5c\uc138\ud604 (yeahagod87@naver.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"wide_plain@nate.com","mem_nm":"\ud55c\ud61c\uc9c4","mem_no":"16040114324389543814","sitter":"\ud55c\ud61c\uc9c4 (wide_plain@nate.com)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0},{"email":"iamnara29@daum.net","mem_nm":"\ud669\uacbd\uc774","mem_no":"1605082041568653046","sitter":"\ud669\uacbd\uc774 (iamnara29@daum.net)","level_title":"\ubbf8\uc9c0\uc815","key-1":0,"key-2":0,"key-3":0,"key-4":0,"key-5":0,"key-6":0,"key-7":0,"key-8":0,"weighted_total":0}]};
				this.refresh_proc(isInitial, mock);
		  });
	}


	render(){
    return(
  		<MuiThemeProvider>
				<div>
					<div className="clearfix">
						<RadioButtonGroup name="isApproved" style={{
								display: 'flex', flexWrap: 'wrap'
							}} className="pull-left"
							defaultSelected={this.state.isApproved} onChange={(e, v) => {
								if (v !== this.state.isApproved) {
									this.setState(update(this.state, {'isApproved': {
										$set: v
									}}));
									setTimeout(this.refresh.bind(this), 100);
								}
							}}>
							<RadioButton value="" label="모든 유형" className='score-radio'
								style={{width: 'auto', marginRight: '30px'}} />
							<RadioButton value="Y" label="승인" className='score-radio'
								style={{width: 'auto', marginRight: '30px'}} />
							<RadioButton value="N" label="미승인" className='score-radio'
								style={{width: 'auto', marginRight: '30px'}} />
						</RadioButtonGroup>
						<div className="pull-right">
							<RaisedButton label="기본순서 설정" secondary={true}
								href="/manage/sitter-search-order" target="_blank"
								style={{marginRight: 10}} />
							<RaisedButton label="지표 관리" primary={true}
								href="/manage/score-entries" target="_blank" />
						</div>
					</div>
					<div ref="handsontable"></div>

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
