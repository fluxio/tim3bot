import React, { PropTypes } from 'react';

import TaskList from './task-list';
import { taskShape } from '../lib/shapes';

function DashboardView({ tasks, createTask, completeTask }) {
  return (
    <TaskList
      tasks={tasks}
      createTask={createTask}
      completeTask={completeTask}
    />
  );
}

DashboardView.propTypes = {
  tasks: PropTypes.arrayOf(taskShape).isRequired,
  createTask: PropTypes.func.isRequired,
  completeTask: PropTypes.func.isRequired,
};

export default DashboardView;
