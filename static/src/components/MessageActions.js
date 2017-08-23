import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import CommunicationTextsms from 'material-ui/svg-icons/communication/textsms';
import UserDisplay from './UserDisplay';
import * as messageActionCreators from '../actions/messages';
import * as userActionCreators from '../actions/users';
import * as moment from 'moment';

function mapStateToProps(state, props) {
    const { messageId } = props.params;
    const message = state.messages.messages.find( m => m.id == parseInt( messageId ) );
    return {
        isFetching: state.messages.isFetching,
        loaded: state.messages.loaded,
        message,
        parent: state.messages.messages.find( m => m.id == message.parent ),
        responses: state.messages.messages.filter( m => m.parent == parseInt( messageId ) ),
        users: state.users.users
    };
}


function mapDispatchToProps(dispatch) {
    const actionCreators = { ...messageActionCreators, ...userActionCreators };
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class MessageDetailView extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchMessages, fetchUsers, postMessage } = this.props;
        fetchMessages();
        fetchUsers();
    }


    render() {
        const { isFetching, loaded, message, parent, responses, users, postMessage } = this.props;

        if ( ! message || ! users ) {
            return null;
        }

        let message_time = moment.unix( message.timestamp );
        let user = users.find( u => u.id == parseInt( message.author ) );

        return (
            <div className="col-md-8">
                <h1>Message Details</h1>
                <Divider inset={false} />
                { parent && ( <MessageParent key={parent.id} message={parent} /> ) }
                <Paper style={{ padding: '20px' }}>
                    <MessageView message={message} withLinks={true} />
                    <MessageActions postMessage={postMessage} message={message} author={user} />
                 </Paper>
                 { responses.map( response => ( <MessageResponse key={response.id} message={response} /> ) ) }
            </div>
        );
    }
}

/**
 * Map the props for a MessageParent or MessageResponse component.
 */
const mapChildStateToProps = (state, props) => {
    const { message } = props;
    return {
        parent: state.messages.messages.find( m => m.id == message.parent ),
        responses: state.messages.messages.filter( m => m.parent == message.id ),
        author: state.users.users.find( u => u.id == message.author ),
        outgoing_to: state.users.users.find( u => u.id == message.outgoing_to ),
        users: state.users.users
    };
}

@connect(mapChildStateToProps)
class MessageParent extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        const { message, author, parent } = this.props;

        return (
            <div style={{ 
                    borderLeft: '2px solid blue',
                    padding: '.5em .5em .5em 1em',
                    marginLeft: '1em',
                }} >
                { parent && ( <MessageParent key={parent.id} message={parent} /> ) }
                <MessageLink message={message} />
            </div>
        );
    }
}

@connect(mapChildStateToProps)
class MessageResponse extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        const { message, author, responses } = this.props;

        return (
            <div style={{ 
                    borderLeft: '2px solid blue',
                    padding: '.5em .5em .5em 1em',
                    marginLeft: '1em',
                }} >
                <MessageLink message={message} />
                <Divider inset={false} />
                 { responses && responses.map( response => ( <MessageResponse key={response.id} message={response} /> ) ) }
            </div>
        );
    }
}

@connect(mapChildStateToProps)
class MessageLink extends React.Component {
    render() {
        const { message } = this.props;

        return (
            <Link to={`/messages/${message.id}`}>
                <MessageView message={message} withLinks={false} />
            </Link>
        );
    }
}

@connect(mapChildStateToProps)
class MessageView extends React.Component {
    render() {
        const { message, author, outgoing_to, withLinks } = this.props;
        const message_time = moment.unix( message.timestamp );

        return (
            <div>
                <p><b>Message Text: </b> {message.text}</p>
                { outgoing_to ? (
                    <p>Sent { message_time.fromNow() } to <UserDisplay withLinks={withLinks} user={outgoing_to} 
                        /> by <UserDisplay withLinks={withLinks} user={author} /></p>
                ) : (
                    <p>Received { message_time.fromNow() } from <UserDisplay withLinks={withLinks} user={author} /></p>
                ) }
            </div>
        );
    }
}

class MessageActions extends React.Component {
    constructor( props )  {
        super( props );
        this.state = {
            open: false,
            anchorEl: null,
            replyText: ''
        };
    }

    handleOpen = event => {
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }

    updateText = (event) => {
        this.setState({ 
            replyText: event.target.value 
        });
    }

    sendResponse = () => {
        const { message, postMessage } = this.props;
        const { replyText } = this.state;

        const postMessageRequest = postMessage({
            to: message.author,
            in_response_to: message.id,
            message_text: replyText
        });
        
        this.setState({ replyText: '', open: false });
    }

    render() {
        const { message, author } = this.props;
        const { open, anchorEl, replyText } = this.state;

        return (
            <Toolbar>
                 <ToolbarGroup>
                     <ToolbarTitle text="Actions" />
                     <IconButton onTouchTap={this.handleOpen}><CommunicationTextsms /></IconButton>
                     <Popover open={open} anchorEl={anchorEl} style={ { padding: '0 10px 10px' } }>
                         <TextField 
                            fullWidth={true}
                            value={replyText}
                            onChange={this.updateText}
                            floatingLabelText={ `Reply to ${author.name} via SMS` }
                            multiLine={true} rows={3} rowsMax={6}
                            />
                        <RaisedButton 
                            label="Send Message" 
                            primary={true} 
                            disabled={! replyText.length}
                            onTouchTap={this.sendResponse}
                            />
                    </Popover>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}
export default MessageDetailView;