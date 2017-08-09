import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import * as actionCreators from '../actions/messages';

function mapStateToProps(state) {
    return {
        isFetching: state.messages.isFetching,
        loaded: state.messages.loaded,
        messages: state.messages.messages,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Messages extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchMessages } = this.props;
        fetchMessages();
    }
    render() {
        const { isFetching, loaded, messages } = this.props;
        return (
            <div className="col-md-8">
                <h1>{ messages.length } New Messages</h1>
                <Divider inset={false} />
                <List> 
                    { messages.map( message => 
                       <ListItem key={ message.id }
                            primaryText={message.text}
                            secondaryText={
                                <p>
                                    Sent on { message.timestamp } 
                                    by user { message.author }
                                </p>
                            } />
                     ) }
                </List>
                <hr />
            </div>
        );
    }
}

export default Messages;
