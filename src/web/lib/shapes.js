import { PropTypes } from 'react';

const user = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const userShape = PropTypes.shape(user);

const task = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.any.isRequired,
  estimate: PropTypes.number.isRequired,
  daysSpent: PropTypes.number.isRequired,
};

const taskShape = PropTypes.shape(task);

export {
  userShape,
  taskShape,
};
