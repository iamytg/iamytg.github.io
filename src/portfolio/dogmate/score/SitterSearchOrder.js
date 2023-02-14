import '../main.css';

import React from 'react';
import update from 'react-addons-update';
import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Snackbar, Paper, RaisedButton, List, ListItem} from 'material-ui';
// import 'react-data-grid/dist/react-data-grid.css';

import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';


const SortableItem = SortableElement(({idx, value}) =>
	<ListItem primaryText={'(기존 순서: ' + value.basic_order + ') ' + value.mem_nm}
		secondaryText={value.s_mem_email + ', ' + value.street}
		className="sitter-search-order-listitem" />);

const SortableList = SortableContainer(({items}) => {
    return (
        <List>
            {items.map((value, index) =>
                <SortableItem key={`item-${index}`} index={index} value={value} idx={index} />
            )}
        </List>
    );
});

export default class SitterSearchOrder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			snackbar: {open: false, message: ''}, canSave: false,
			items: []
		}
	}

	componentDidMount () {
		this.refresh(true);
	}

	refresh_proc (isInitial, data) {
		if (isInitial) {
		} else {
		}
		this.setState({items: data});
		console.debug(data);
	}

	refresh (isInitial) {
		axios.get('/manage/sitter-search-order/fetch')
			.then(response => {
				// console.log(response);
				this.refresh_proc(isInitial, response.data);
		  }).catch(response => {
				axios.get('/mockups/dogmate/sitter-search-order.json')
					.then(response2 => {
						this.refresh_proc(isInitial, response2.data);
					});
		  });
	}

	onSortEnd ({oldIndex, newIndex}) {
		this.setState({
        items: arrayMove(this.state.items, oldIndex, newIndex)
    });
		// console.debug(this.state.items);
		this.show_snackbar('목록 하단의 저장 버튼을 누르셔야 변경사항이 적용됩니다.');
	}

	show_snackbar (msg) {
		this.setState(update(this.state, {'snackbar': {
			open: {$set: true}, message: {$set: msg}
		}}));
	}


	render(){
    return(
  		<MuiThemeProvider>
				<div style={{width: 450, height: '100%', paddingBottom: 70}} className="clearfix">
					<Paper zDepth={1} style={{height: '100%', overflow: 'auto'}}>
						<SortableList items={this.state.items} lockAxis="y"
							useWindowAsScrollContainer={true}
							onSortEnd={this.onSortEnd.bind(this)} />
					</Paper>

					<div className="pull-right" style={{marginTop: 20}}>
						<RaisedButton label="저장" primary={true} onClick={
								() => {
							// console.log(this.state.items);
									axios.post('/manage/sitter-search-order/submit', this.state.items)
										.then(response => {
											console.log(response);
											window.location.reload();
									  }).catch(response => {
											alert('저장할 수 없습니다.');
									  });
								}
							} />
					</div>

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
