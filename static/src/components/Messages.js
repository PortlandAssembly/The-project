import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import * as messageActionCreators from '../actions/messages';
import * as userActionCreators from '../actions/users';
import * as moment from 'moment';

function mapStateToProps(state) {
    return {
        isFetching: state.messages.isFetching,
        loaded: state.messages.loaded,
        messages: state.messages.messages,
        users: state.users.users
    };
}

function mapDispatchToProps(dispatch) {
    const actionCreators = { ...messageActionCreators, ...userActionCreators };
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchMessages, fetchUsers } = this.props;
        fetchMessages();
        fetchUsers();
    }
    render() {
        const { isFetching, loaded, messages, users } = this.props;
        return (
            <div className="col-md-8">
                <h1>{ messages.length } New Messages</h1>
                <Divider inset={false} />
                <List> 
                    { messages.map( message => {
                        let message_time = moment.unix( message.timestamp );
                        let user = users.find( u => u.id == parseInt( message.author ) );
                        return (
                           <ListItem key={ message.id }
                                primaryText={
                                    <Link to={`/messages/${message.id}`}>{message.text}</Link>
                                }
                                secondaryText={
                                    <p>
                                        { message_time.fromNow() } 
                                        <span style={{ float: 'right' }}>from { user.name ? user.name : user.phone }</span>
                                    </p>
                                } />
                        ) }
                     ) }
                </List>
                <hr />
            </div>
        );
    }
}

export default Messages;
