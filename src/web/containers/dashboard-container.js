import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DashboardView from '../components/dashboard-view';
import {
  fetchTasks,
} from '../actions';
import { getSortedTasks } from '../selectors';
import { taskShape } from '../lib/shapes';

class DashboardContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    this.props.fetchTasks();
  }

  render() {
    const { tasks } = this.props;

    return tasks ? (
      <DashboardView tasks={tasks} />
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    tasks: getSortedTasks(state),
  };
}

DashboardContainer.propTypes = {
  fetchTasks: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(taskShape).isRequired,
};

export default connect(mapStateToProps, {
  fetchTasks,
})(DashboardContainer);
