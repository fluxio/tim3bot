import React, { PropTypes } from 'react';

import Card from '../base-components/card';
import { OrderedList } from '../base-components/list';
import Task from './task';
import NewTask from './new-task';
import { taskShape } from '../lib/shapes';

function TaskList({ tasks, createTask }) {
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
      <NewTask createTask={createTask} />
    </Card>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(taskShape).isRequired,
  createTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  tasks: [],
};

export default TaskList;
