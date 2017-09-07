import { FETCH_INCOMING_MESSAGES_REQUEST, RECEIVE_INCOMING_MESSAGES, NEW_MESSAGE_NOTIFICATION } from '../constants/index';
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

    [NEW_MESSAGE_NOTIFICATION]: (state, payload) => {
        let messages = state.messages;

        // Remove this message from the state if it's already there. Mark it as unread and re-add it.
        const newMsg = Object.assign({}, payload.message, { unread: true });

        messages = messages.filter( m => m.id !== newMsg.id ).concat(newMsg);

        return Object.assign({}, state, {
            messages: messages,
            isFetching: false,
            loaded: true,
        });
    },
});
