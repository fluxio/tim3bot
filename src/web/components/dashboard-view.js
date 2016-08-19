import React, { PropTypes } from 'react';

import Navbar from './navbar';
import TaskList from './task-list';
import { taskShape } from '../lib/shapes';


function DashboardView({ tasks }) {
  return (
    <TaskList tasks={tasks} />
  );
}

DashboardView.propTypes = {
  tasks: PropTypes.arrayOf(taskShape).isRequired,
};

export default DashboardView;
