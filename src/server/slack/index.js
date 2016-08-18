const Botkit = require('botkit');

const storage = require('./storage');

const config = require('../../../config/server-config');

// Conversation strings.
const OPENERS = ['hi', 'yo', 'help', 'status'];

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

// Initial commands for the bot:
//  - General "openers" for initiating converation with the bot.
//  - Listing tasks/getting status.

controller.hears(OPENERS, ['direct_message'], (bot, message) => {
  controller.storage.users.get(message.user, function(err, user) {
    let name = (user && user.name) || 'human';
// If user isn't logged in yet.
// startPrivateConversation

    // If user has no tasks, get tasks.
// If user has never had tasks, maybe
    bot.reply(message, `Hi, ${name}, I\'m tim3bot.`);
    getTasksFromUser(bot, message, user);

    // If user has tasks, show status.
    // bot.reply(message, `Heya ${name}. `);


  });
});

controller.hears(['list', 'tasks'], ['direct_message'], (bot, message) => {
  // Show status.
  showTaskList(bot, message);
});

controller.hears(['add', 'addtask.*'], ['direct_message'], (bot, message) => {
  // Add a single task.
  showTaskList(bot, message);
  getTasksFromUser(bot, message);
});

// Conversations

let tasks = [];

function getTaskPrompt() {
  switch (tasks.length) {
    case 0:
      return `Let's track your top 3 priorities for the week. What's the first?`;
    case 1:
      return `What's your second priority for the week?`;
    case 2:
      return `What's your third priority for the week?`;
  }
}

function getTasksFromUser(bot, message) {
  function askNewTask(response, convo) {
    convo.say(getTaskPrompt());
    convo.ask('Please describe it in one line.', [
      {
        pattern: '.*',
        callback: (response, convo) => {
          tasks.push({ title: response.text });
          console.info('-----------', tasks);
          askEstimate(response, convo);
          convo.next();
        }
      }
    ]);
  };

  function askEstimate(response, convo) {
    convo.ask('How many days do you think this will take _(e.g. "1.5d")_?', [
      {
        pattern: '.*([0-9]*\.?[0-9]+).*',
        callback: (response, convo) => {
          console.info(response, response.match);
          var task = tasks[tasks.length - 1];
          var days = parseFloat(response.match[0]);
          task.estimate = days;
          if (tasks.length < 3) {
            askNewTask(response, convo);
          }
          convo.next();
        }
      },
      {
        pattern: '.*',
        callback: (response, convo) => {
          convo.say(`Oops! Couldn't tell how many days you're estimating.`);
          convo.repeat();
          convo.next();
        }
      }
    ]);
  }

  bot.startConversation(message, (response, convo) => {
    askNewTask(response, convo);
    convo.on('end', convo => {
      if (convo.status == 'completed') {
        bot.reply(message, `OK!`);
        showTaskList(bot, message);
        bot.reply(message, `I'll check in on how you're doing at the end of every day.`);
      }
    });
  });
}

function showTaskList(bot, message) {
  if (tasks.length) {
    bot.reply(message, 'Here are your top priorities for the week:\n' +
    tasks.map((task, index) => {
      return `${index + 1}\) ${task.title} \(${dayFormat(task.estimate)} days\)`;
    }).join('\n'));
  } else {
    bot.reply(message, `You don't have any tasks set up for the week, yet.`);
  }
}

function dayFormat(floatNumDays) {
  let daysStr = floatNumDays.toString();
  if (daysStr.indexOf('.') >= 0) {
    return floatNumDays.toFixed(2);
  } else {
    return daysStr;
  }
}
