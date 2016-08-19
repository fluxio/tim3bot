import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { fetchProfile } from '../actions';
import LayoutView from '../components/layout-view/index';

class LayoutContainer extends Component {
  componentDidMount() {
    this.props.fetchProfile();
  }

  render() {
    const { isLoggedIn, children } = this.props;

    return (
      <LayoutView
        isLoggedIn={isLoggedIn}
      >
        {children}
      </LayoutView>
    );
  }
}

LayoutContainer.propTypes = {
  fetchProfile: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

LayoutContainer.defaultProps = {
  isLoggedIn: false,
};

function mapStateToProps(state = {}) {
  return {
    isLoggedIn: !!(state.currentUser && state.currentUser.id),
  };
}

export default connect(mapStateToProps, {
  fetchProfile,
})(LayoutContainer);
