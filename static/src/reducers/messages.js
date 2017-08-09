import { FETCH_INCOMING_MESSAGES_REQUEST, RECEIVE_INCOMING_MESSAGES } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    messages: [],
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_INCOMING_MESSAGES]: (state, payload) =>
        Object.assign({}, state, {
            messages: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_INCOMING_MESSAGES_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
