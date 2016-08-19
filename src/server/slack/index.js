const Botkit = require('botkit');

const storage = require('./storage');
const userRepo = require('../repos/user-repo');
const taskRepo = require('../repos/task-repo');

const config = require('../../../config/server-config');

// Conversation strings.
const OPENERS = ['hi', 'yo', 'status'];

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

controller.hears(OPENERS, ['direct_message'], (bot, message) => {
  controller.storage.users.get(message.user, (err, user) => {
    if (!user) {
      initializeUser(bot, message, initializeTasksForUser);
    } else {
      bot.reply(message, `Hi, ${user.name}, I\'m *TIM3BOT* :stopwatch::robot_face::stopwatch:\nI'm gonna help you stay focused and improve time estimations... plus, I'll put an extra little spring in your step :dancer:`);

      getTasksForUser(user)
        .then(tasks => {
          if (!tasks.length) {
            initializeTasksForUser(bot, message, user);
          } else {
            showTaskList(bot, message, user, tasks);
          }
        });
    }
  });
});

function initializeUser(bot, message, callback) {
  bot.reply(message, "Hi there! I'm tim3bot.");

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
          .then(user => {
            convo.say(`Great! Nice to meet you, ${user.name}`);
            convo.next();
          });
      },
    }]);

    conversation.on('end', () => callback(bot, message, callback));
  });
}

function getTasksForUser(user) {
  return taskRepo.select({ query: { userId: user.id } });
}

controller.hears(['list', 'tasks'], ['direct_message'], (bot, message) => {
  // Show status.
  showTaskList(bot, message);
});

controller.hears(['help', 'commands'], ['direct_message'], (bot, message) => {
  showHelp(bot, message);
});

controller.hears(['add', 'addtask.*'], ['direct_message'], (bot, message) => {
  // Add a single task.
  showTaskList(bot, message);
  initializeTasksForUser(bot, message);
});

function initializeTasksForUser(bot, message, user, callback) {
  initializeTask(bot, message, user, "To get started, what's your highest priority task?", () => {
    initializeTask(bot, message, user, 'Thanks! What else is on your plate?', () => {
      initializeTask(bot, message, user, "Nice one! Let's add one more task.", callback);
    });
  });
}

function initializeTask(bot, message, user, taskString, callback) {
  if (taskString) {
    bot.reply(message, taskString);
  }

  bot.startConversation(message, (err, conversation) => {
    getTaskDescription(message, conversation);

    conversation.on('end', convo => {
      if (convo.status === 'completed' && callback) {
        bot.reply(message, 'Great!');
        bot.reply(message, `You can see your tasks by saying \`list\` at anytime.\n` +
          // Need to add joined list of tasks Here
          'Use \`add\` to create new tasks. Type a number at the end to add an estimate, e.g. \`add Fix the damn coffee machine 0.25\`.\nI’ll do a regular check-in on weekdays at 5pm, or use \`checkin\` at anytime. Type \`help\` to see a list of commands.\nThat’s all for now. See you later! :spock-hand:'
        );

        callback();
      }
    });
  });

  function getTaskDescription(response, conversation) {
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
    conversation.ask('Great! How many days will this take, e.g. `2.5`.', [{
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

function showTaskList(bot, message) {
  userRepo.selectOne({ query: { slackId: message.user } })
    .then(user => (
      taskRepo.select({ query: { userId: user.id } })
    ))
    .then(tasks => {
      if (tasks.length) {
        console.log('tasks:', tasks)
        const taskList = tasks.map((task, index) => (
          `${index + 1}. ${task.title} \(Estimate: ${dayFormat(task.estimate)} days\)`
        )).join('\n');

        bot.reply(message, `Here’s what you've got on your plate right now:\n${taskList}`);
      } else {
        bot.reply(message, "You don't have any tasks set up for the week yet.");
      }
    });
}

function dayFormat(floatNumDays) {
  const daysStr = floatNumDays.toString();

  return daysStr.indexOf('.') >= 0 ? floatNumDays.toFixed(2) : daysStr;
}

function showHelp(bot, message) {
  bot.reply(message, 'OK. I\'m here. It\'s all under control!\nHere\'s a list of things you can say to start moving my sweet robotic cogs:\n:heavy_plus_sign:\`add\` with a description and a day estimate creates a whole new task.\n\:clipboard:`list\` displays all the tasks you have entered.\n:bellhop_bell:\`checkin\` will begin a little check-in session.\n:trophy:`score\` will display your TIM3BOT Certified Reliability Score.\n:heavy_check_mark:\`done\` after logging time during Check-in will mark a task as completed.\n'

    );
}
