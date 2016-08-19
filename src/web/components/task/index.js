import React from 'react';

import { ListItem } from '../../base-components/list';
import { taskShape } from '../../lib/shapes';
import { IN_PROGRESS } from '../../lib/constants/task-states';

import styles from './task.scss';

function pluralizeDays(numDays) {
  return numDays === 1 ? `${numDays} day` : `${numDays} days`;
}

function getDescription({ daysEstimated, daysSpent, completed }) {
  let description = '';

  if (!completed) {
    const estimateLeft = daysEstimated - daysSpent;
    description = `Logged ${pluralizeDays(daysSpent)}, \
${pluralizeDays(estimateLeft)} of work remaining`;
  } else if (daysSpent > daysEstimated) {
    const daysOver = daysSpent - daysEstimated;

    description = `Completed in ${pluralizeDays(daysSpent)}, \
${pluralizeDays(daysOver)} over estimate`;
  } else if (daysSpent < daysEstimated) {
    const daysUnder = daysEstimated - daysSpent;

    description = `Completed in ${pluralizeDays(daysSpent)}, \
${pluralizeDays(daysUnder)} under estimate`;
  } else {
    description = `Completed in ${pluralizeDays(daysSpent)}, right on estimate \u{1f638}`;
  }

  return description;
}

function Task({ task }) {
  const { title, daysEstimated, completed, daysSpent } = task;
  const description = getDescription(task);
  const barWidth = Math.max(daysSpent, daysEstimated) * 15;
  const dangerWidth = daysSpent < daysEstimated ? 0 :
    ((daysSpent - daysEstimated) / daysSpent) * 100;
  const warningWidth = dangerWidth ? 100 - dangerWidth : (daysSpent / daysEstimated) * 100;

  const completedClassName = completed ? styles.successBar : styles.warningBar;

  return (
    <ListItem>
      <div className={styles.title}>
        {title}
      </div>
      <div className={styles.bar} style={{ width: `${barWidth}em` }}>
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
