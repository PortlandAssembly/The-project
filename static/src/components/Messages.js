import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Badge from 'material-ui/Badge';

import * as moment from 'moment';

import * as messageActionCreators from '../actions/messages';
import * as userActionCreators from '../actions/users';

function mapStateToProps(state) {
    return {
        isFetching: state.messages.isFetching,
        loaded: state.messages.loaded,
        messages: state.messages.messages.filter( m => m.parent == null ),
        allMessages: state.messages.messages,
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

    getReplies( msg ) {
        const { allMessages } = this.props;
        return allMessages.filter( m => m.parent == msg.id )
    }

    countReplies( msg ) {
        let r = this.getReplies( msg );
        return r.length + r.map( m => this.countReplies(m) ).reduce( (pv, cv) => pv + cv, 0 )
    }

    countUnread( msg ) {
        let r = this.getReplies( msg );
        return r.map( m => this.countUnread(m) ).reduce( (pv, cv) => pv + cv, ( msg.unread ? 1 : 0 )  )
    }

    render() {
        const { isFetching, loaded, messages, users, allMessages } = this.props;
        return (
            <div className="col-md-8">
                <h1>{ messages.length } New Messages</h1>
                <Divider inset={false} />
                <List> 
                    { messages.map( message => {
                        let replies = this.countReplies( message );
                        let unreadReplies = this.countUnread( message );
                        let message_time = moment.unix( message.timestamp );
                        let user = users.find( u => u.id == parseInt( message.author ) );
                        return (
                           <ListItem key={ message.id }
                                primaryText={
                                    <div>
                                        { (unreadReplies) ? ( <Badge badgeContent={unreadReplies} primary={true} /> ) : '' }
                                        <Link to={`/messages/${message.id}`}>{message.text}</Link>
                                    </div>
                                }
                                secondaryText={
                                    <p>
                                        { message_time.fromNow() } <i>{ replies } replies</i>
                                        <span style={{ float: 'right' }}>from { user.name ? user.name : user.phone }</span>
                                    </p>
                                } />
                          );
                    } ) }
                </List>
                <hr />
            </div>
        );
    }
}

export default Messages;
