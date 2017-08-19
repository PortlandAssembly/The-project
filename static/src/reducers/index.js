import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import data from './data';
import messages from './messages';
import users from './users';
import tags from './tags';

const rootReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    auth,
    data,
    messages,
    users,
    tags,
});

export default rootReducer;
