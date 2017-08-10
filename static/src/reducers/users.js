import { FETCH_USERS_REQUEST, RECEIVE_USERS } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    users: [],
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_USERS]: (state, payload) =>
        Object.assign({}, state, {
            users: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_USERS_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
