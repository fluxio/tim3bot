import React from 'react';

import { ListItem } from '../../base-components/list';
import { taskShape } from '../../lib/shapes';
import { IN_PROGRESS } from '../../lib/constants/task-states';

import styles from './task.scss';

function pluralizeDays(numDays) {
  return numDays === 1 ? 'day' : 'days';
}

function Task({ task: { title, estimate, state } }) {
  const daysSpent = 3;
  const description = `\
${estimate} ${pluralizeDays(estimate)} estimated, \
${daysSpent} ${pluralizeDays(daysSpent)} logged`;
  const dangerWidth = daysSpent > estimate ? ((daysSpent - estimate) / daysSpent) * 100 : 0;
  const warningWidth = dangerWidth ? 100 - dangerWidth : (2 / estimate) * 100;

  const completedClassName = state === IN_PROGRESS ? styles.warningBar : styles.successBar;

  return (
    <ListItem>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.bar}>
        <div className={completedClassName} style={{ width: `${warningWidth}%` }} />
        <div className={styles.dangerBar} style={{ width: `${dangerWidth}%` }} />
      </div>
      <div className={styles.description}>
        {description}
      </div>
    </ListItem>
  );
}

Task.propTypes = {
  task: taskShape.isRequired,
};

export default Task;
