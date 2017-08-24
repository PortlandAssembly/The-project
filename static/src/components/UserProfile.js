import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import { List, ListItem, } from 'material-ui/List';
import Chip from 'material-ui/Chip';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import TagSelector from './TagSelector';
import RaisedButton from 'material-ui/RaisedButton';
import * as userActionCreators from '../actions/users';
import * as tagsActionCreators from '../actions/tags';

function mapStateToProps(state, props) {
    const { userId } = props.params;
    return {
        isFetching: state.users.isFetching,
        loaded: state.users.loaded,
        user: state.users.users.find( u => u.id == parseInt( userId ) ),
        tags: state.tags.tags
    };
}

function mapDispatchToProps(dispatch) {
    const actionCreators = { ...userActionCreators, ...tagsActionCreators };
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class UserProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchUsers, fetchTags } = this.props;
        fetchUsers();
        fetchTags()
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

    handleUpdateTags = newTags => {
        const { user } = this.props;
        user.tags = newTags;
        user.isDirty = true;
        this.setState({ user });
    }

    handleReset = () => console.log( 'Resetting to default values' );

    render() {
        const { user, tags, handleUpdateUser } = this.props;
        if ( ! user || ! tags ) { 
            return null; // loading
        }
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
                <TagSelector 
                    header="User Tags"
                    searchLabel="Add a tag to this user"
                    currentTags={user.tags} availableTags={tags} 
                    onUpdateTags={this.handleUpdateTags.bind(this)} />
                <Link to={`/messages/${user.last_msg}`}>Last message</Link>
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
