import React, { Component } from 'react';

import { fetchProfile } from '../api';
import { LOGOUT_PATH } from '../lib/constants/paths';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    fetchProfile()
      .then(profile => {
        this.setState({
          user: profile,
        });
      });
  }

  render() {
    const { user } = this.state;

    return user ? (
      <div>
        Welcome to tim3bot, {user.name}!
        <a href={LOGOUT_PATH}>Logout</a>
      </div>
    ) : null;
  }
}

export default DashboardContainer;
