import { FETCH_USERS_REQUEST, UPDATE_USER_REQUEST, RECEIVE_USERS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { get_all_users, update_user } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import { browserHistory } from 'react-router';

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

export function updateUserRequest() {
    return {
        type: UPDATE_USER_REQUEST,
        isFetching: true
    };
}

export function fetchUsers() {
    return (dispatch) => {
        dispatch(fetchUsersRequest());
        get_all_users()
            .then(parseJSON)
            .then(response => {
                dispatch(receiveUsers(response));
            })
            .catch(error => {
                console.log(error)
            });
    };
}

export function handleUpdateUser(user) {
    return (dispatch) => {
        dispatch(updateUserRequest());
        update_user(user)
            .then(parseJSON)
            .then(response => {
                browserHistory.push('/users');
                dispatch(receiveUsers(response));
            })
            .catch(error => {
                console.log(error)
            });
    }
}
