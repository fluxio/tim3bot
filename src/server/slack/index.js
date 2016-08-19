const Botkit = require('botkit');

const storage = require('./storage');

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
    bot.reply(message, `Hi, ${name}, I\'m *TIM3BOT* :stopwatch::robot_face::stopwatch:\nI’m gonna help you stay focussed and improve time estimations ... plus, I'll put an extra little spring in your step :dancer:`);
    getTasksFromUser(bot, message, user);

    // If user has tasks, show status.
    // bot.reply(message, `Heya ${name}. `);


  });
});

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
  getTasksFromUser(bot, message);
});

// Conversations

let tasks = [];

function getTaskPrompt() {
  switch (tasks.length) {
    case 0:
      return `To get started, what’s your highest priority task?`;
    case 1:
      return `Thanks! What else is on your plate?`;
    case 2:
      return `Nice one! Let’s add one more task.`;
  }
}

function getTasksFromUser(bot, message) {
  function askNewTask(response, convo) {
    convo.say(getTaskPrompt());
    convo.ask('...:lower_left_paintbrush:', [
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
    convo.ask('Great! How many days will this take, e.g. `2.5`.', [
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
        bot.reply(message, `Great!`);
        showTaskList(bot, message);
        bot.reply(message, `You can see your tasks by saying \`list\` at anytime.\n` +
        //Need to add joined list of tasks Here
          'Use \`add\` to create new tasks. Type a number at the end to add an estimate, e.g. \`add Fix the damn coffee machine 0.25\`.\nI’ll do a regular check-in on weekdays at 5pm, or use \`checkin\` at anytime. Type \`help\` to see a list of commands.\nThat’s all for now. See you later! :spock-hand:'
          );
      }
    });
  });
}

function showTaskList(bot, message) {
  if (tasks.length) {
    bot.reply(message, 'Here’s what you’ve got on your plate right now:\n' +
    tasks.map((task, index) => {
      return `${index + 1}. ${task.title} \nEstimate: ${dayFormat(task.estimate)} days\n`;
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

function showHelp(bot, message) {
  bot.reply(message, 'OK. I\'m here. It\'s all under control!\nHere\'s a list of things you can say to start moving my sweet robotic cogs:\n:heavy_plus_sign:\`add\` with a description and a day estimate creates a whole new task.\n\:clipboard:`list\` displays all the tasks you have entered.\n:bellhop_bell:\`checkin\` will begin a little check-in session.\n:trophy:`score\` will display your TIM3BOT Certified Reliability Score.\n:heavy_check_mark:\`done\` after logging time during Check-in will mark a task as completed.\n'
    
    );
}
