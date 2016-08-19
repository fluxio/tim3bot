const Botkit = require('botkit');

const storage = require('./storage');
const userRepo = require('../repos/user-repo');
const taskRepo = require('../repos/task-repo');

const config = require('../../../config/server-config');

// Command matching strings.
const OPENERS = ['hi', 'yo', 'status'];
const LIST = ['list', 'tasks'];
const HELP = ['help', 'commands'];
const ADD = ['add', 'addtask.*'];
const CHECKIN = ['checkin', 'log', 'update'];

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

// Listeners for all commands.

controller.hears(OPENERS, ['direct_message'], (bot, message) => {
  controller.storage.users.get(message.user, (err, user) => {
    if (!user) {
      initializeUser(bot, message, initializeTasksForUser);
    } else {
      bot.reply(message, `Welcome back, ${user.name}!`);

      getTasksForSlackUser(user.slackId)
        .then(tasks => {
          if (!tasks.length) {
            initializeTasksForUser(bot, message);
          } else {
            showTaskList(bot, message);
          }
        });
    }
  });
});

controller.hears(LIST, ['direct_message'], (bot, message) => {
  showTaskList(bot, message);
});

controller.hears(HELP, ['direct_message'], (bot, message) => {
  showHelp(bot, message);
});

controller.hears(ADD, ['direct_message'], (bot, message) => {
  showTaskList(bot, message, () => {
    initializeTask(bot, message, null, () => {
      showTaskList(bot, message);
    });
  });
});

controller.hears(CHECKIN, ['direct_message'], (bot, message) => {
  getTasksForSlackUser(message.user).then(tasks => {
    console.info(tasks);
    // if (!tasks.length) {
    //   initializeTasksForUser(bot, message);
    // } else {
    //   showTaskList(bot, message);
    // }
  });
});

// Helper functions for all ensuing conversations.

function initializeUser(bot, message, callback) {
  const welcomeMessage = `Hi, I'm *TIM3BOT* :stopwatch:robot_face:stopwatch:
I'm gonna help you stay focused and improve your time estimations... \
plus, I'll put an extra little spring in your step :dancer:`;
  let user = null;

  bot.reply(message, welcomeMessage);

  bot.startConversation(message, (err, conversation) => {
    conversation.ask("What's your name?", [{
      pattern: '.*',
      callback: (responseMessage, convo) => {
        const name = responseMessage.text;

        userRepo.create({
          data: {
            name,
            slackId: responseMessage.user,
          },
        })
          .then(res => {
            user = res[0];

            convo.say(`Great! Nice to meet you, ${user.name}. Let's get started!`);
            convo.next();
          });
      },
    }]);

    conversation.on('end', convo => {
      if (convo.status === 'completed') {
        callback(bot, message);
      }
    });
  });
}

function getUser(slackId) {
  return userRepo.selectOne({ query: { slackId: slackId } });
}

function getTasksForSlackUser(slackId) {
  return getUser(slackId).then(user => (
    taskRepo.select({ query: { userId: user.id } })
  ));
}

function initializeTasksForUser(bot, message, callback) {
  const FIRST_TASK = "To get started, what's your highest priority task?";
  const SECOND_TASK = 'Thanks! What else is on your plate?';
  const THIRD_TASK = "Nice one! Let's add one more task.";
  const INITIALIZED_TASKS = `You can see your tasks by saying \`list\` at any time.
Use \`add\` to create new tasks. Type a number at the end to add an estimate, \
e.g. \`add Fix the damn coffee machine 0.25\`.
I’ll do a regular check-in on weekdays at 5pm, or use \`checkin\` at anytime.
Type \`help\` to see a list of commands.
That’s all for now. See you later! :spock-hand:`;

  initializeTask(bot, message, FIRST_TASK, () => {
    initializeTask(bot, message, SECOND_TASK, () => {
      initializeTask(bot, message, THIRD_TASK, () => {
        bot.reply(message, INITIALIZED_TASKS);

        if (callback) {
          callback();
        }
      });
    });
  });
}

function initializeTask(bot, message, taskString, callback) {
  taskString = taskString || 'What do you want to add next?';
  bot.reply(message, taskString);

  getUser(message.user).then((user) => {
    bot.startConversation(message, (err, conversation) => {
      getTaskDescription(message, conversation, user);

      conversation.on('end', convo => {
        if (convo.status === 'completed' && callback) {
          bot.reply(message, 'Great!');

          callback();
        }
      });
    });
  });

  function getTaskDescription(response, conversation, user) {
    conversation.ask('...:lower_left_paintbrush:', [{
      pattern: '.*',
      callback: (askResponse, convo) => (
        taskRepo.create({
          data: {
            userId: user.id,
            title: askResponse.text,
          },
        })
          .then(res => {
            getTaskEstimate(askResponse, convo, res[0]);
            convo.next();
          })
      ),
    }]);
  }

  function getTaskEstimate(response, conversation, task) {
    conversation.ask('Great! How many days will this take, e.g. `2.5`?', [{
      pattern: '.*([0-9]*\.?[0-9]+).*',
      callback: (askResponse, convo) => {
        const estimate = parseFloat(askResponse.match[0]);

        return taskRepo.update({
          query: { id: task.id },
          data: { estimate },
        })
          .then(() => {
            convo.next();
          });
      },
    }, {
      pattern: '.*',
      callback: (askResponse, convo) => {
        convo.say("Oops! Couldn't tell how many days you're estimating.");
        convo.repeat();
        convo.next();
      },
    }]);
  }
}

function showTaskList(bot, message, callback) {
  getTasksForSlackUser(message.user)
    .then(tasks => {
      if (tasks.length) {
        const taskList = tasks.map((task, index) => (
          `${index + 1}. ${task.title}\n\tEstimate: ${dayFormat(task.estimate)} days`
        )).join('\n');

        bot.reply(message, `Here’s what you've got on your plate right now:\n${taskList}`);
      } else {
        bot.reply(message, "You don't have any tasks set up for the week yet.");
      }
    })
    .then(() => {
      if (callback) {
        callback();
      }
    });
}

function dayFormat(floatNumDays) {
  const daysStr = floatNumDays.toString();

  return daysStr.indexOf('.') >= 0 ? floatNumDays.toFixed(2) : daysStr;
}

function showHelp(bot, message) {
  const helpMessage = `Ok, I'm here. It's all under control!
Here's a list of things you can say to start moving my sweet robotic cogs:
\t:heavy_plus_sign: \`add\` with a description and a day estimate creates a whole new task.
\t:clipboard: \`list\` displays all the tasks you have entered.
\t:bellhop_bell: \`checkin\` will begin a little check-in session.
\t:trophy: \`score\` will display your TIM3BOT Certified Reliability Score.
\t:heavy_check_mark: \`done\` after logging time during check-in will mark a task as completed.`;

  bot.reply(message, helpMessage);
}
