const BaseRepo = require('./base-repo');

const CHANNEL_TABLE = 'channels';

const DEFAULT_SELECT = ['id', 'slackId'];

class ChannelRepo extends BaseRepo {
  constructor() {
    super(CHANNEL_TABLE, {
      defaultSelect: DEFAULT_SELECT,
    });
  }
}

module.exports = new ChannelRepo();
