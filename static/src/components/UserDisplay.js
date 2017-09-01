import React from 'react';
import { Link } from 'react-router';

class UserDisplay extends React.Component {
    render() {
        const { user, withLinks } = this.props;

        if ( withLinks ) {
            return (
                <Link title={user.phone} to={`/users/${user.id}`} >
                    { user.name ? user.name : user.phone }
                </Link>
            );
        } else {
            return ( <span>{ user.name ? user.name : user.phone }</span> );
        }
    }
}

export default UserDisplay;
