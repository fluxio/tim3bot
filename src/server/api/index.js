const express = require('express');

const requireAuthentication = require('../middleware/require-authentication');
const taskRepo = require('../repos/task-repo');

const router = new express.Router();

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
    select: [
      'id',
      'title',
      'createdAt',
      'estimate',
      'daysSpent',
      'state',
    ],
  })
    .then(normalize)
    .then(tasks => res.json(tasks))
    .catch(next);
});

module.exports = router;
