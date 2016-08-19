import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DashboardView from '../components/dashboard-view';
import {
  fetchTasks,
  createTask,
  completeTask,
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

    // this.refetch();
  }

  refetch() {
    const self = this;

    setTimeout(() => {
      if (!self.props.fetching.tasks) {
        self.props.fetchTasks();
      }

      self.refetch();
    }, 2000);
  }

  render() {
    return this.props.tasks ? (
      <DashboardView
        tasks={this.props.tasks}
        createTask={this.props.createTask}
        completeTask={this.props.completeTask}
      />
    ) : null;
  }
}

DashboardContainer.propTypes = {
  fetchTasks: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  completeTask: PropTypes.func.isRequired,
  tasks: PropTypes.arrayOf(taskShape).isRequired,
  fetching: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    fetching: state.entities.fetching,
    tasks: getSortedTasks(state),
  };
}

export default connect(mapStateToProps, {
  fetchTasks,
  createTask,
  completeTask,
})(DashboardContainer);
