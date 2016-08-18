const Botkit = require('botkit');

const storage = require('./storage');

const config = require('../../../config/server-config');

const controller = Botkit.slackbot({
  debug: false,
  storage,
});

controller.spawn({ token: config.SLACK_API_TOKEN })
  .startRTM(err => {
    if (err) {
      throw err;
    }
  });

controller.hears(['hi'], ['direct_message'], (bot, message) => {
  controller.storage.users.get(message.user, (err, user) => {
    if (err) {
      throw err;
    } else {
      bot.reply(message, `Hi yourself, ${user.name}!`);
    }
  });
});
