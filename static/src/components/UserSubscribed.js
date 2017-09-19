import React from 'react';

import Checkbox from 'material-ui/Checkbox';
import ActionAlarmOff from 'material-ui/svg-icons/action/alarm-off';
import ActionAlarmOn from 'material-ui/svg-icons/action/alarm-on';
import { cyan500, gray500 } from 'material-ui/styles/colors';

export default class UserSubscribedToggle extends React.Component {

    handleToggleStatus = () => {
        const { userSubscribed, onUpdateValue } = this.props;
        onUpdateValue( ! userSubscribed );
    }

    render() {
        const { userSubscribed } = this.props;

        return (
            <Checkbox
                checked={ userSubscribed }
                onCheck={this.handleToggleStatus.bind(this)}
                checkedIcon={<ActionAlarmOn />}
                uncheckedIcon={<ActionAlarmOff color={gray500} />}
                label={ userSubscribed ? "Subscribed to alerts" : "Unsubscribed from all alerts" }
                style={{ marginTop: '10px' }}
                labelStyle={{ color: userSubscribed ? cyan500 : gray500 }}
            />
        );
    }
}


export class UserSubscribedIndicator extends React.Component {

    render() {
        const { userSubscribed } = this.props;

        const styleProps = {
            style: {
                float: 'right',
                margin: '0 -36px 0 24px',
                color: userSubscribed ? cyan500 : gray500,
            }
        };

        return userSubscribed ? 
            ( <ActionAlarmOn {...styleProps} /> ) :
            ( <ActionAlarmOff {...styleProps} /> );
    }
}
