import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TagSelector from './TagSelector';

import * as messageActionCreators from '../actions/messages';
import * as eventActionCreators from '../actions/events';
import * as userActionCreators from '../actions/users';
import * as tagActionCreators from '../actions/tags';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

function mapStateToProps(state, props) {
    return {
        tags: state.tags.tags,
        users: state.users.users,
    };
}

function mapDispatchToProps(dispatch) {
    const actionCreators = { ...messageActionCreators, ...tagActionCreators };
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Broadcast extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message_text: '',
            currentTags: [],
        };
    }

    componentDidMount() {
        const { fetchTags } = this.props;
        fetchTags();
    }

    updateMessageText = event => this.setState({ message_text: event.target.value })
    updateTags = newTags => this.setState({ currentTags: newTags });

    handleSendBroadcast = () => {
        const { event, postBroadcast } = this.props;
        const { message_text, currentTags } = this.state;
        postBroadcast({
            message_text,
            event: event.id,
            filters: currentTags
        });

        this.setState({ message_text: '', currentTags: [], verifiers_only: false });
    }

    updateCheck = () => {
        this.setState( oldState => {
            return {
                verifiers_only: ! oldState.verifiers_only,
            };
        });
    }

    render() {
        const { tags, users, postBroadcast } = this.props;
        const { message_text, currentTags, verifiers_only } = this.state;

        const audience = users
            .filter( user => ( !! user.phone ) )
            .filter( user => ! verifiers_only || 'verifier' === user.role )
            .filter( user => {
                for ( let currentTag of currentTags ) {
                    if ( -1 === user.tags.indexOf( currentTag ) ) {
                        return false;
                    }
                }
                return true;
            });

        return (
            <Paper style={{ padding: '20px' }}>
                <h3>Filter users to send broadcast to by tags:</h3>
                <TagSelector 
                    header="Filter audience by tags:"
                    searchLabel="Search for Tag"
                    currentTags={currentTags} availableTags={tags} 
                    onUpdateTags={this.updateTags} 
                    />
                 <Checkbox
                    label="Send to verifiers only"
                    checked={this.state.verifiers_only}
                    onCheck={this.updateCheck.bind(this)}
                />
                <TextField 
                    value={message_text}
                    onChange={this.updateMessageText}
                    floatingLabelText="Compose broadcast"
                    fullWidth={true} rows={2} rowsMax={4}
                />
                <RaisedButton
                    label={ audience.length ?
                        `Send Broadcast to ${audience.length} users` :
                        "No users in segment"
                    }
                    primary={true} disabled={'' === message_text || 0 === audience.length}
                    onTouchTap={this.handleSendBroadcast}
                    />
            </Paper>
        );

    }
}
