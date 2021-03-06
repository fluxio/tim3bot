const express = require('express');

const requireAuthentication = require('../middleware/require-authentication');
const taskRepo = require('../repos/task-repo');

const router = new express.Router();

const TASK_SELECT = [
  'id',
  'title',
  'createdAt',
  'daysEstimated',
  'daysSpent',
  'state',
];

function normalize(entities) {
  return entities.reduce((accumulator, entity) => (
    Object.assign({}, accumulator, { [entity.id]: entity })
  ), {});
}

router.all('*', requireAuthentication);

router.get('/profile', (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
  });
});

router.post('/tasks/:id', (req, res, next) => {
  taskRepo
    .update({
      query: { id: req.params.id },
      data: req.body,
      select: TASK_SELECT,
    })
    .then(response => response[0])
    .then(task => { res.json(task); })
    .catch(next);
});

router.get('/tasks', (req, res, next) => {
  taskRepo.select({
    query: { userId: req.user.id },
    select: TASK_SELECT,
  })
    .then(tasks => tasks.filter(task => !!task.daysEstimated))
    .then(normalize)
    .then(tasks => res.json(tasks))
    .catch(next);
});

router.post('/tasks', (req, res, next) => {
  const task = Object.assign({}, req.body, {
    userId: req.user.id,
  });

  taskRepo.create({
    data: task,
    select: TASK_SELECT,
  })
    .then(response => res.json(response[0]))
    .catch(next);
});

module.exports = router;
