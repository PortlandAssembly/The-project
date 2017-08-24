import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { MessageView, MessageActions } from './MessageActions';
import { Link } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar'
import Popover from 'material-ui/Popover/Popover';
import IconButton from 'material-ui/IconButton';
import { Menu, MenuItem } from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import UserDisplay from './UserDisplay';
import * as messageActionCreators from '../actions/messages';
import * as eventActionCreators from '../actions/events';
import * as userActionCreators from '../actions/users';
import Broadcast from './Broadcast';

function mapStateToProps(state, props) {
    const { eventId } = props.params;
    const event = state.events.events.find( e => e.id == parseInt( eventId ) );
    const eventMessages = state.messages.messages.filter( m => m.event == event.id );
    return {
        event,
        eventMessages,
        users: state.users.users
    };
}


function mapDispatchToProps(dispatch) {
    const actionCreators = { ...messageActionCreators, ...eventActionCreators, ...userActionCreators };
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class EventDetails extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchEvents, fetchMessages, fetchUsers, postMessage } = this.props;
        fetchEvents();
        fetchMessages();
        fetchUsers();
    }

    render() {
        const { isFetching, loaded, event, eventMessages, users, postMessage  } = this.props;

        if ( isFetching ) {
            return ( <div>Loading</div> );
        };

        if ( ! event ) {
            return ( <div>Not found: {this.props.params.eventId}</div> );
        }

        return (
            <div className="col-md-8">
                <h1>Event Details</h1>
                <Divider inset={false} />
                <h2>{event.name}</h2>
                <p>{event.description}</p>
                { ( ! eventMessages.length ) && ( <p>No messages associated with this event yet.</p> ) }
                { eventMessages.map( message => {
                    let user = users.find( u => u.id == message.author )
                    return (
                        <Paper style={{ padding: '10px 20px 5px', marginBottom: '10px' }}>
                            <MessageView message={message} withLinks={true} />
                         </Paper>
                    ) }
               ) }
               <Broadcast event={event} />
            </div>
        );
    }
}

export default EventDetails;

