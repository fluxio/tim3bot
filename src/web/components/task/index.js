import React, { PropTypes } from 'react';

import { ListItem } from '../../base-components/list';
import { taskShape } from '../../lib/shapes';
import { INCOMPLETE } from '../../lib/constants/task-states';

import styles from './task.scss';

function pluralizeDays(numDays) {
  return numDays === 1 ? `${numDays} day` : `${numDays} days`;
}

function getDescription({ daysEstimated, daysSpent, state }) {
  let description = '';

  if (state === INCOMPLETE) {
    if (daysSpent > daysEstimated) {
      const daysOver = daysSpent - daysEstimated;

      description = `Logged ${pluralizeDays(daysSpent)}, \
  ${pluralizeDays(daysOver)} over estimate`;
    } else {
      const estimateLeft = daysEstimated - daysSpent;

      description = `Logged ${pluralizeDays(daysSpent)}, \
  ${pluralizeDays(estimateLeft)} of work remaining`;
    }
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

const completeTaskMessage = 'Complete \u2714';

function Task({ task, completeTask }) {
  const { title, daysEstimated, state, daysSpent } = task;
  const description = getDescription(task);
  const barWidth = Math.min(Math.max(daysSpent, daysEstimated) * 15, 60);
  const dangerWidth = daysSpent < daysEstimated ? 0 :
    ((daysSpent - daysEstimated) / daysSpent) * 100;
  const warningWidth = dangerWidth ? 100 - dangerWidth : (daysSpent / daysEstimated) * 100;

  const completedClassName = state !== INCOMPLETE ? styles.successBar : styles.warningBar;

  return (
    <ListItem>
      <div className={styles.title}>
        {title}
        {state === INCOMPLETE ? (
          <button onClick={completeTask.bind(null, task)} className={styles.completeTask}>
            {completeTaskMessage}
          </button>
        ) : null}
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
  completeTask: PropTypes.func.isRequired,
};

export default Task;
