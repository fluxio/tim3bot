const BaseRepo = require('./base-repo');

const USER_TABLE = 'users';

const DEFAULT_SELECT = ['id', 'name'];

class UserRepo extends BaseRepo {
  constructor() {
    super(USER_TABLE, {
      defaultSelect: DEFAULT_SELECT,
      upsertIndex: 'slackId',
    });
  }

  create({ data = {}, select } = {}) {
    return super.create({
      select,
      data: Object.assign({}, data, { name: data.name || data.displayName }),
    });
  }
}

module.exports = new UserRepo();
