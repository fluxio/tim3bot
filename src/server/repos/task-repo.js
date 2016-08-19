const BaseRepo = require('./base-repo');

const TASK_TABLE = 'tasks';

const DEFAULT_SELECT = ['id', 'title', 'daysEstimated', 'daysSpent', 'state'];

class TaskRepo extends BaseRepo {
  constructor() {
    super(TASK_TABLE, {
      defaultSelect: DEFAULT_SELECT,
    });
  }

  upsert() {
    throw new Error('Not implemented');
  }

  findOrCreate() {
    throw new Error('Not implemented');
  }

  create(...args) {
    return super.create(...args);
  }
}

module.exports = new TaskRepo();
