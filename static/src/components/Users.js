import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import * as actionCreators from '../actions/users';
import * as moment from 'moment';

function mapStateToProps(state) {
    return {
        isFetching: state.users.isFetching,
        loaded: state.users.loaded,
        users: state.users.users,
        users: state.users.users
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class Users extends React.Component { // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        const { dispatch, fetchUsers } = this.props;
        fetchUsers();
    }
    render() {
        const { isFetching, loaded, users } = this.props;
        return (
            <div className="col-md-8">
                <h1>{ users.length } Users</h1>
                <Divider inset={false} />
                <List> 
                    { users.map( user => {
                        return (
                           <ListItem key={ user.id }
                                primaryText={user.phone}
                                />
                        ) }
                     ) }
                </List>
                <hr />
            </div>
        );
    }
}

export default Users;
