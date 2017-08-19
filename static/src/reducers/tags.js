import { FETCH_TAGS_REQUEST, RECEIVE_TAGS } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    tags: [],
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_TAGS]: (state, payload) =>
        Object.assign({}, state, {
            tags: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_TAGS_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
