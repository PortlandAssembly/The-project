import { FETCH_EVENTS_REQUEST, UPDATE_EVENT_REQUEST, RECEIVE_EVENTS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { get_all_events, create_event } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import { browserHistory } from 'react-router';

export function receiveEvents(data) {
    return {
        type: RECEIVE_EVENTS,
        payload: {
            data,
        },
        isFetching: false,
        receivedAt: Date.now(),
    };
}

export function fetchEventsRequest() {
    return {
        type: FETCH_EVENTS_REQUEST,
        isFetching: true
    };
}

export function updateEventRequest() {
    return {
        type: UPDATE_EVENT_REQUEST,
        isFetching: true
    };
}

export function fetchEvents(token) {
    return (dispatch) => {
        dispatch(fetchEventsRequest());
        get_all_users(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveEvents(response));
            })
            .catch(error => {
                console.log(error)
            });
    };
}

export function createEvent(event, message_id) {
    return (dispatch) => {
        create_event( event, message_id )
            .then(parseJSON)
    }
}

export function handleUpdateEvent(user, token) {
    return (dispatch) => {
        dispatch(updateEventRequest());
        update_user(user)
            .then(parseJSON)
            .then(response => {
                browserHistory.push('/events');
                dispatch(receiveEvents(response));
            })
            .catch(error => {
                console.log(error)
            });
    }
}
