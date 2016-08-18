const Botkit = require('botkit');

const config = require('../../../config/server-config');

const controller = Botkit.slackbot({
  debug: false,
});

const bots = {};

function startBot(token = config.SLACK_API_TOKEN) {
  if (!bots[token]) {
    bots[token] = true;

    controller.spawn({ token })
      .startRTM(err => {
        if (err) {
          bots[token] = false;

          throw err;
        } else {
          bots[token] = true;
        }
      });
  }
}

controller.hears(['hi'], ['direct_message'], (bot, message) => {
  bot.reply(message, 'Hi yourself!');
});

module.exports = {
  startBot,
};
