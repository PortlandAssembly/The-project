import { FETCH_USERS_REQUEST, RECEIVE_USERS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { get_all_users } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';

export function receiveUsers(data) {
    return {
        type: RECEIVE_USERS,
        payload: {
            data,
        },
        isFetching: false,
        receivedAt: Date.now(),
    };
}

export function fetchUsersRequest() {
    return {
        type: FETCH_USERS_REQUEST,
        isFetching: true
    };
}

export function fetchUsers(token) {
    return (dispatch) => {
        dispatch(fetchUsersRequest());
        get_all_users(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveUsers(response));
            })
            .catch(error => {
                console.log(error)
            });
    };
}
