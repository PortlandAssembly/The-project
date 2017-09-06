import { NEW_MESSAGE_NOTIFICATION } from '../constants/index';
import { createReducer } from '../utils/misc';

const initialState = {
    messages: [],
    isFetching: false,
    loaded: false,
};

export default function reducer(state = {}, action) {
    switch (action.type) {
        case NEW_MESSAGE_NOTIFICATION: 
            console.log( state, action );
            let messages = state.messages;

            // Update and replace any existing messages to avoid duplication
            const newMsg = action.data.message;
            messages = messages.filter( m => m.id !== newMsg.id ).concat(newMsg);
            return Object.assign({}, state, {
                messages: messages,
                isFetching: false,
                loaded: true,
            });
        default:
            return state;
    }
};
