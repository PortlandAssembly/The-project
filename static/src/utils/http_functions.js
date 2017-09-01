/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
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

export function has_github_token(token) {
    return axios.get('/api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
    return axios.get('/api/user', tokenConfig(token));
}

export function get_new_messages(token) {
    return axios.get('/api/messages', tokenConfig(token));
}

export function post_new_message(message) {
    const token = localStorage.getItem('token');
    return axios.post('/api/outgoing', message, tokenConfig(token) );
}

export function post_broadcast(message) {
    const token = localStorage.getItem('token');
    return axios.post('/api/broadcast', message, tokenConfig(token) );
}

export function get_all_users(token) {
    return axios.get('/api/users', tokenConfig(token));
}

export function update_user(user, token) {
    let { id } = user;
    return axios.post(`/api/user/${id ? id : 'new'}`, {
        user
    });
}

export function get_all_tags(token) {
    return axios.get('/api/tags', tokenConfig(token));
}

export function create_tag(tag, token) {
    let { tag_type, tag_name } = tag;
    console.log( tag, tag_type, tag_name );
    return axios.post('/api/create_tag', {
        tag_type,
        tag_name
    });
}

export function delete_tag(tag, token) {
    let { id } = tag;
    return axios.delete(`/api/tag/${id}`, tag );
}

export function update_tag(tag, token) {
    let { id } = tag;
    return axios.post(`/api/tag/${id ? id : 'new'}`, {
        tag
    });
}

export function get_all_events(token) {
    return axios.get('/api/events', tokenConfig(token));
}

export function create_event(event, message_id) {
    return axios.put('/api/event', { ...event, message_id } );
}
