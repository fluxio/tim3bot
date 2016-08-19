import React, { PropTypes } from 'react';

import { ListItem } from '../../base-components/list';
import { taskShape } from '../../lib/shapes';

import styles from './task.scss';

function pluralizeDays(numDays) {
  return numDays === 1 ? 'day' : 'days';
}

function Task({ task: { title, estimate } }) {
  const daysSpent = 3;
  const description = `${estimate} ${pluralizeDays(estimate)} estimated`;
  const dangerWidth = daysSpent > estimate ? ((daysSpent - estimate) / daysSpent) * 100 : 0;
  const warningWidth = dangerWidth ? 100 - dangerWidth : (2 / estimate) * 100;

  return (
    <ListItem>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.bar}>
        <div className={styles.warning} style={{ width: `${warningWidth}%` }} />
        <div className={styles.danger} style={{ width: `${dangerWidth}%` }} />
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
