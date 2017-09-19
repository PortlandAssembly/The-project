import { FETCH_INCOMING_MESSAGES_REQUEST, RECEIVE_INCOMING_MESSAGES, POST_NEW_MESSAGE_REQUEST, POST_BROADCAST_REQUEST } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { get_new_messages, post_new_message, post_broadcast } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

export function receiveMessages(data) {
    return {
        type: RECEIVE_INCOMING_MESSAGES,
        payload: {
            data,
        },
        isFetching: false,
        receivedAt: Date.now(),
    };
}

export function fetchMessagesRequest() {
    return {
        type: FETCH_INCOMING_MESSAGES_REQUEST,
        isFetching: true
    };
}

export function postMessageRequest() {
    return {
        type: POST_NEW_MESSAGE_REQUEST,
        isFetching: true
    };
}

export function postBroadcastRequest() {
    return {
        type: POST_BROADCAST_REQUEST,

    };
}

export function fetchMessages() {
    return (dispatch) => {
        dispatch(fetchMessagesRequest());
        get_new_messages()
            .then(parseJSON)
            .then(response => {
                dispatch(receiveMessages(response));
            })
            .catch(error => {
                console.log(error)
            });
    };
}

export function postMessage(message) {
    return (dispatch) => {
        dispatch(postMessageRequest());
        post_new_message(message)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveMessages(response));
            })
            .catch(error => {
                console.log(error)
            });
    }
}

export function postBroadcast(message) {
    return (dispatch) => {
        dispatch(postBroadcastRequest());
        post_broadcast(message)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveMessages(response))
            })
            .catch(error => {
                console.log(error)
            });
    }
}
