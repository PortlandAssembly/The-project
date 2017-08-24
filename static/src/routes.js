/* eslint new-cap: 0 */

import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from './containers/App';
import { HomeContainer } from './containers/HomeContainer';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import ProtectedView from './components/ProtectedView';
import Messages from './components/Messages';
import MessageActions from './components/MessageActions';
import Users from './components/Users';
import UserProfile from './components/UserProfile';
import Events from './components/Events';
import Tags from './components/Tags';
import NotFound from './components/NotFound';

import { DetermineAuth } from './components/DetermineAuth';
import { requireAuthentication } from './components/AuthenticatedComponent';
import { requireNoAuthentication } from './components/notAuthenticatedComponent';

export default (
    <Route path="/" component={App}>
        <Route path="main" component={requireAuthentication(ProtectedView)} />
        <Route path="login" component={requireNoAuthentication(LoginView)} />
        <Route path="register" component={requireNoAuthentication(RegisterView)} />
        <Route path="home" component={requireNoAuthentication(HomeContainer)} />
        <Route path="messages" component={requireAuthentication(Messages)} />
        <Route path="messages/:messageId" component={requireAuthentication(MessageActions)} />
        <Route path="users" component={requireAuthentication(Users)} />
        <Route path="users/:userId" component={requireAuthentication(UserProfile)} />
        <Route path="events" component={requireAuthentication(Events)} />
        <Route path="tags" component={requireAuthentication(Tags)} />
        <Route path="*" component={DetermineAuth(NotFound)} />
    </Route>
);
