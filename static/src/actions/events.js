import { FETCH_EVENTS_REQUEST, UPDATE_EVENT_REQUEST, RECEIVE_EVENTS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { get_all_events, create_event, update_event } from '../utils/http_functions';

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
        get_all_events()
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
        dispatch(updateEventRequest());
        create_event( event, message_id )
            .then(parseJSON)
            .then(response => dispatch(receiveEvents(response)))
            .catch(console.log);
    }
}

export function updateEvent(event) {
    return (dispatch) => {
        dispatch(updateEventRequest());
        update_event( event.id, event )
            .then(parseJSON)
            .then(response => dispatch(receiveEvents(response)))
            .catch(console.log);
    }
}
