import { FETCH_INCOMING_MESSAGES_REQUEST, RECEIVE_INCOMING_MESSAGES } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    messages: [],
    isFetching: false,
    loaded: false,
};

export default createReducer(initialState, {
    [RECEIVE_INCOMING_MESSAGES]: (state, payload) => {
        let messages = state.messages;
        // Update and replace any existing messages to avoid duplication
        for ( let newMsg of payload.data ) {
            messages = messages.filter( m => m.id !== newMsg.id ).concat(newMsg);
        }
        return Object.assign({}, state, {
            messages: messages,
            isFetching: false,
            loaded: true,
        });
    },
    [FETCH_INCOMING_MESSAGES_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
});
