import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import ActionAssignmentLate from 'material-ui/svg-icons/action/assignment-late';
import ActionAssignmentTurnedIn from 'material-ui/svg-icons/action/assignment-turned-in';
import { cyan500, gray500 } from 'material-ui/styles/colors';

export default class EventStatusToggle extends React.Component {

    handleToggleStatus = () => {
        const { eventStatus, onUpdateValue } = this.props;
        onUpdateValue( ! eventStatus );
    }

    render() {
        const { eventStatus } = this.props;

        return (
            <Checkbox
                checked={ eventStatus }
                onCheck={this.handleToggleStatus.bind(this)}
                checkedIcon={<ActionAssignmentLate />}
                uncheckedIcon={<ActionAssignmentTurnedIn color={gray500} />}
                label={ eventStatus ? "Event Active" : "Event Archived" }
                style={{ marginTop: '10px' }}
                labelStyle={{ color: eventStatus ? cyan500 : gray500 }}
            />
        );
    }
}

export class EventStatusIndicator extends React.Component {
    render() {
        const { eventStatus } = this.props;

        const styleProps = {
            style: {
                float: 'right',
                margin: '0 -36px 0 24px',
                color: eventStatus ? cyan500 : gray500,
            }
        };

        return eventStatus ? 
            ( <ActionAssignmentLate {...styleProps} /> ) :
            ( <ActionAssignmentTurnedIn {...styleProps} /> );
    }
}
