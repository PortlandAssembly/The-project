import { FETCH_TAGS_REQUEST, UPDATE_TAG_REQUEST, RECEIVE_TAGS } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { get_all_tags, create_tag, delete_tag, update_tag } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import { browserHistory } from 'react-router';

export function receiveTags(data) {
    return {
        type: RECEIVE_TAGS,
        payload: {
            data,
        },
        isFetching: false,
        receivedAt: Date.now(),
    };
}

export function fetchTagsRequest() {
    return {
        type: FETCH_TAGS_REQUEST,
        isFetching: true
    };
}

export function updateTagRequest() {
    return {
        type: UPDATE_TAG_REQUEST,
        isFetching: true
    };
}

export function fetchTags(token) {
    return (dispatch) => {
        dispatch(fetchTagsRequest());
        get_all_tags(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveTags(response));
            })
            .catch(error => {
                console.log(error)
            });
    };
}

export function handleCreateTag(tag, token) {
    return (dispatch) => {
        dispatch(updateTagRequest());
        create_tag(tag)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveTags(response));
            })
            .catch(error => {
                console.log(error)
            });
    }
}

export function handleDeleteTag(tag, token) {
    return (dispatch) => {
        dispatch(updateTagRequest());
        delete_tag(tag)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveTags(response));
            })
            .catch(error => {
                console.log(error)
            });
    }
}

export function handleUpdateTag(tag, token) {
    return (dispatch) => {
        dispatch(updateTagRequest());
        update_tag(tag)
            .then(parseJSON)
            .then(response => {
                browserHistory.push('/tags');
                dispatch(receiveTags(response));
            })
            .catch(error => {
                console.log(error)
            });
    }
}
