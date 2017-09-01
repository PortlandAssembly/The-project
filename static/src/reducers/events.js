import { FETCH_EVENTS_REQUEST, RECEIVE_EVENTS } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    events: [],
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_EVENTS]: (state, payload) =>
        Object.assign({}, state, {
            events: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_EVENTS_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
