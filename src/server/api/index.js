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

router.get('/tasks', (req, res, next) => {
  taskRepo.select({
    query: { userId: req.user.id },
    select: TASK_SELECT,
  })
    .then(normalize)
    .then(tasks => res.json(tasks))
    .catch(next);
});

router.post('/tasks', (req, res, next) => {
  taskRepo.create({
    data: req.body,
    select: TASK_SELECT,
  })
    .then(response => res.json(response[0]))
    .catch(next);
});

module.exports = router;
