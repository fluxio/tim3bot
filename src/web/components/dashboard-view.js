import React, { PropTypes } from 'react';

import TaskList from './task-list';
import { taskShape } from '../lib/shapes';
// import { LOGOUT_PATH } from '../lib/constants/paths';

function DashboardView({ tasks }) {
  return (
    <div>
      <TaskList tasks={tasks} />
    </div>
  );
}

DashboardView.propTypes = {
  tasks: PropTypes.arrayOf(taskShape).isRequired,
};

export default DashboardView;
