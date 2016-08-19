import { createSelector } from 'reselect';

function sort(key) {
  return entities => entities.concat().sort((a, b) => (
    a[key] < b[key] ? -1 : 1)
  );
}

const tasks = state => state.entities.tasks;

const getTasks = createSelector(
  tasks,
  taskEntities => Object.keys(taskEntities).map(id => taskEntities[id])
);

const getSortedTasks = createSelector(
  getTasks,
  sort('createdAt')
);

export {
  getSortedTasks,
};
