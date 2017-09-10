/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token || localStorage.getItem('token'), // eslint-disable-line quote-props
    },
});

const authHeader = () => tokenConfig(localStorage.getItem('token'))

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function create_user(email, password) {
    return axios.post('/api/create_user', {
        email,
        password,
    });
}

export function get_token(email, password) {
    return axios.post('/api/get_token', {
        email,
        password,
    });
}

export function data_about_user(token) {
    return axios.get('/api/user', tokenConfig(token));
}

export function get_new_messages(token) {
    return axios.get('/api/messages', tokenConfig(token));
}

export function post_new_message(message) {
    const token = localStorage.getItem('token');
    return axios.post('/api/outgoing', message, authHeader() );
}

export function post_broadcast(message) {
    return axios.post('/api/broadcast', message, authHeader() );
}

export function get_all_users() {
    return axios.get('/api/users', authHeader());
}

export function update_user(user) {
    let { id } = user;
    return axios.post(`/api/user/${id ? id : 'new'}`, {
        user
    }, authHeader());
}

export function get_all_tags() {
    return axios.get('/api/tags', authHeader())
}

export function create_tag(tag) {
    let { tag_type, tag_name } = tag;
    console.log( tag, tag_type, tag_name );
    return axios.post('/api/create_tag', {
        tag_type,
        tag_name
    }, authHeader());
}

export function delete_tag(tag) {
    let { id } = tag;
    return axios.delete(`/api/tag/${id}`, tag, authHeader() );
}

export function update_tag(tag) {
    let { id } = tag;
    return axios.post(`/api/tag/${id ? id : 'new'}`, { tag }, authHeader());
}

export function get_all_events() {
    return axios.get('/api/events', {}, authHeader());
}

export function create_event(event, message_id) {
    return axios.put('/api/event', { ...event, message_id }, authHeader());
}
