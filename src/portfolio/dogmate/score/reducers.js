import update from 'react-addons-update';
import { combineReducers } from 'redux';
import * as actions from './actions';

const entry = (state = [], action) => {
  switch (action.type) {
    case actions.REFRESH:
      return action.list;

    case actions.CHANGE_ENTRY:
      let param = {changed: {$set: new Date()}};
      param[action.change.name] = {$set: action.change.value};

      return update(state, {[action.change.idx]: param});

    case actions.NEW_ENTRY:
      return [...state, {
        entry_no: '[신규]', entry_automated: 'N'
      }];

    default:
      return state;
  }
}

const reducers = combineReducers({entry});

export default reducers;
