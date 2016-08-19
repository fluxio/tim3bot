import React, { PropTypes } from 'react';

import TaskList from './task-list';
import { taskShape } from '../lib/shapes';

function DashboardView({ tasks, createTask }) {
  return (
    <TaskList
      tasks={tasks}
      createTask={createTask}
    />
  );
}

DashboardView.propTypes = {
  tasks: PropTypes.arrayOf(taskShape).isRequired,
  createTask: PropTypes.func.isRequired,
};

export default DashboardView;
