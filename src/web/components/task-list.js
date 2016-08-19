import React, { PropTypes } from 'react';

import Card from '../base-components/card';
import { OrderedList } from '../base-components/list';
import Task from './task';
import { taskShape } from '../lib/shapes';

function TaskList({ tasks }) {
  return (
    <Card label="Your Tasks">
      <OrderedList>
        {tasks.map((task, index) => (
          <Task
            key={index}
            task={task}
          />
        ))}
      </OrderedList>
    </Card>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(taskShape).isRequired,
};

TaskList.defaultProps = {
  tasks: [],
};

export default TaskList;
