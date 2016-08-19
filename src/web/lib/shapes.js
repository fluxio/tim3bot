import { PropTypes } from 'react';

import { TASK_STATES } from './constants/task-states';

const user = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const userShape = PropTypes.shape(user);

const task = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.any.isRequired,
  daysEstimated: PropTypes.number.isRequired,
  daysSpent: PropTypes.number.isRequired,
  completed: PropTypes.bool.isRequired,
};

const taskShape = PropTypes.shape(task);

export {
  userShape,
  taskShape,
};
