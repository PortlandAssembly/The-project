import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';

import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import Badge from 'material-ui/Badge';
import CommunicationChat from 'material-ui/svg-icons/communication/chat';
import ActionToday from 'material-ui/svg-icons/action/today';

function mapStateToProps(state, props) {
    const { messages } = state.messages;
    const { events } = state.events;

    // Note the event.active flag is in a different branch so it's commented out here.
    return {
        messageCount: messages.filter( m => m.parent === 0 && m.event === 0 ).length,
        unreadMessageCount: messages.filter( m => m.event === 0 && m.unread ).length,
        eventCount: events/*.filter( e => e.active )*/.length,
        unreadEventCount: messages.filter( m => events/*.filter( e => e.active )*/.map( e => e.id ).indexOf( m.event ) > -1 && m.unread ).length,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

@connect(mapStateToProps)
export default class FooterNav extends React.Component {
    
    render() {
        const { messageCount, unreadMessageCount, eventCount, unreadEventCount } = this.props;

        console.log( this.props );

        return (
            <Paper zDepth={1}>
                <BottomNavigation>
                    <BottomNavLink
                        label={ "New Messages" }
                        icon={<CommunicationChat />}
                        linkTo="/messages"
                        count={unreadMessageCount}
                        />
                    <BottomNavLink
                        label={ "Events" }
                        icon={<ActionToday />}
                        linkTo="/events"
                        count={unreadEventCount}
                        />
                </BottomNavigation>
            </Paper>
        );
    }
}

export class BottomNavLink extends React.Component {
    render() {
        const { label, icon, linkTo, active, count } = this.props;

        const styleAttrs = {
            style: { 
                padding: 0 
            },
            badgeStyles: {
                right: '24px',
                transform: "translateY(2px)",
            }
        }

        const navItem = (
            <BottomNavigationItem
                label={label}
                icon={icon}
                onClick={() => browserHistory.push(linkTo)}
                />
        );

        if ( count ) {
            return ( <Badge {...styleAttrs} badgeContent={count} secondary={true}>{navItem}</Badge> );
        } else {
            return navItem;
        }
    }
}
