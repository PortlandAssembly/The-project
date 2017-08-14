import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem, } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import * as actionCreators from '../actions/users';

function mapStateToProps(state, props) {
    const { userId } = props.params;
    return {
        isFetching: state.users.isFetching,
        loaded: state.users.loaded,
        user: state.users.users.find( u => u.id == parseInt( userId ) ),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class UserProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchUsers } = this.props;
        fetchUsers();
    }

    handleChangeTextField = (key, event, value ) => {
        const { user } = this.props;
        user[ key ] = value;
        user.isDirty = true;
        this.setState({ user });
    }

    handleChangeSelectField = (key, event, value, index ) => {
        const { user }  = this.props;
        user[ key ] = value;
        user.isDirty = true;
        this.setState({ user });
    }

    //handleUpdateUser = () => {
        //const user = t
    //}

    handleReset = () => console.log( 'Resetting to default values' );

    render() {
        const { user, handleUpdateUser } = this.props;
        if ( ! user ) return;
        return (
            <div className="col-md-8">
                <h1>View / Edit User</h1>
                <Divider inset={false} />
                <TextField 
                    name="name" value={user.name || ''}
                    fullWidth={true} 
                    onChange={this.handleChangeTextField.bind(this,'name')}
                    floatingLabelText="User Display Name" />
                <TextField 
                    name="phone" value={user.phone || ''}
                    fullWidth={true} 
                    onChange={this.handleChangeTextField.bind(this,'phone')}
                    floatingLabelText="Phone Number" />
                <TextField 
                    name="email" value={user.email || ''} 
                    fullWidth={true} 
                    onChange={this.handleChangeTextField.bind(this,'email')}
                    floatingLabelText="Email Address" />
                <SelectField 
                    name="role" value={user.role || 0}
                    fullWidth={true}
                    onChange={this.handleChangeSelectField.bind(this,'role')} 
                    floatingLabelText="User Role" >
                    <MenuItem value={0} primaryText="Responder" />
                    <MenuItem value={1} primaryText="Verifier" />
                    <MenuItem value={2} primaryText="Admin" />
                </SelectField>
                <div style={{ textAlign: 'right' }} >
                    <RaisedButton 
                        label="Reset" 
                        style={{ 
                            display: user.isDirty ? 'inline-block' : 'none',
                            marginRight: '1em'
                        }} 
                        onTouchTap={this.handleReset.bind(this)}
                        />
                    <RaisedButton 
                        label="Save Changes" 
                        primary={true} disabled={!user.isDirty} 
                        onTouchTap={() => handleUpdateUser(user)}
                        />
                </div>
            </div>
        );
    }
}

export default UserProfile;
