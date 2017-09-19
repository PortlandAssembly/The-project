import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import * as eventActionCreators from '../actions/events';

import { EventStatusIndicator } from './EventStatus';

function mapStateToProps(state) {
    return {
        isFetching: state.events.isFetching,
        loaded: state.events.loaded,
        events: state.events.events,
    };
}

function mapDispatchToProps(dispatch) {
    const actionCreators = { ...eventActionCreators };
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Events extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchEvents } = this.props;
        fetchEvents();
    }

    render() {
        const { events } = this.props;
        return (
            <div className="col-md-8">
                <h1>{ events.length } New Events</h1>
                <Divider inset={false} />
                <List> 
                    { events.map( event => {
                        return (
                           <ListItem key={ event.id }
                                primaryText={
                                    <Link to={`/events/${event.id}`}>{event.name}</Link>
                                }
                                rightIcon = { <EventStatusIndicator eventStatus={event.active} /> }
                            />
                        ) }
                     ) }
                </List>
                <hr />
            </div>
        );
    }
}

export default Events;
