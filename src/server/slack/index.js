const Botkit = require('botkit');

const storage = require('./storage');
const userRepo = require('../repos/user-repo');
const taskRepo = require('../repos/task-repo');

const config = require('../../../config/server-config');

// Command matching strings.
const OPENERS = ['hi', 'yo'];
const LIST = ['list', 'tasks'];
const HELP = ['help', 'commands'];
const ADD = ['add', 'addtask.*'];
const CHECKIN = ['checkin', 'log', 'update'];
const SCORE = ['score', 'status'];

const STATE = {
  COMPLETE: 'complete', // Update to 'complete' after column is enum-ified.
  INCOMPLETE: 'incomplete',
  ABANDONED: 'abandoned',
};


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
  getUser(message.user).then(user => {
    bot.reply(message, `:bellhop_bell:Hey ${user.name}! So, what have you been working on?`);
  //  showTaskList(bot, message, () => {
      modifyTasks(bot, message);
  //  });
  });
});

controller.hears(SCORE, ['direct_message'], (bot, message) => {
  showScore(bot, message);
});

// Helper functions for all ensuing conversations.

function modifyTasks(bot, message, callback) {
  const WHICH_TASK =
      '>Type a number to update the task, or use `exit` to end this check-in.';

  let tasks = null;

  getTasksForSlackUser(message.user).then(userTasks => {
    bot.startConversation(message, (response, conversation) => {
      tasks = userTasks;
      showTaskList(bot, message);
      selectTask(response, conversation);

      conversation.on('end', convo => {
        if (convo.state === 'completed' && callback) {
          bot.reply(message, 'All done!');
          callback();
        }
      });
    });
  });

  function selectTask(response, conversation) {
    conversation.ask(WHICH_TASK, [{
      pattern: '([0-9]+)',
      callback: (askResponse, convo) => {
        const taskNumber = parseInt(askResponse.match[0]);
        let task = tasks[taskNumber - 1];
        if (!task) {
          convo.say('Oops! Please indicate a valid task number.');
        } else {
          actOnTask(askResponse, convo, task);
        }
        convo.next();
      },
    }, {
      pattern: '[exit, done]',
      callback: (askResponse, convo) => {
        convo.say('Thanks for checking in! Now get back to work! :stuck_out_tongue_winking_eye:\n>Remember to keep adding new tasks by typing `add`.');
        convo.next();
      },
    }, {
      pattern: '.*',
      callback: (askResponse, convo) => {
        convo.say('Oops! Please indicate a task number, e.g. `2` for the second task.');
        convo.repeat();
        convo.next();
      },
    }]);
  }

  function actOnTask(response, conversation, task) {
    let titleBits = task.title.split(' ');
    let truncatedTitle = (titleBits.length > 4 ?
        titleBits.slice(0,4).join(' ') + '...' :
        task.title);
    let prompt = `:stopwatch: OK. Let's update the status of this task.\n*${truncatedTitle}*\n` +
        '>Log time by using days, e.g. `0.5`.\n>Type `complete` if it\'s done, ' +
        '`delete` to remove the task, ' +
        'or `next` to move on.';

    conversation.ask(prompt, [{
      pattern: '([0-9]*\.?[0-9]+).*',
      callback: (askResponse, convo) => {
        if (askResponse.match && askResponse.match[1]) {
          const daysSpent = parseFloat(askResponse.match[1]);
          return taskRepo.update({
            query: { id: task.id },
            data: { daysSpent: (task.daysSpent + daysSpent) },
          })
            .then(() => {
              showTaskList(bot, message, () => {
                selectTask(askResponse, convo);
              });
              convo.next();
            });
        } else {
          convo.repeat();
          convo.next();
        }
      },
    }, {
      pattern: 'complete',
      callback: (askResponse, convo) => {
        return taskRepo.update({
          query: { id: task.id },
          data: { state: STATE.COMPLETE },
        })
          .then(() => {
            showTaskList(bot, message, () => {
              selectTask(askResponse, convo);
            });
            convo.next();
          });
      },
    }, {
      pattern: 'delete',
      callback: (askResponse, convo) => {
        return taskRepo.delete({
          query: { id: task.id },
        })
          .then(() => {
            showTaskList(bot, message);
            convo.next();
          });
      },
    }, {
      pattern: 'next',
      callback: (askResponse, convo) => {
        showTaskList(bot, message, () => {
          selectTask(askResponse, convo);
        });
        convo.next();
      },
    }, {
      pattern: '.*',
      callback: (askResponse, convo) => {
        convo.say(`Sorry, didn't recognize that action.`)
        convo.repeat();
        convo.next();
      },
    }]);
  }
}


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
        const daysEstimated = parseFloat(askResponse.match[0]);

        return taskRepo.update({
          query: { id: task.id },
          data: { daysEstimated },
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
  getTasksForSlackUser(message.user, {incompleteOnly: true})
    .then(tasks => {
      if (tasks.length) {
        const taskList = tasks.map((task, index) => {
          let workedStr = `estimated ${dayFormat(task.daysEstimated)} days`;
          if (task.daysSpent) {
            if (task.daysSpent > task.daysEstimated) {
              workedStr = `worked ${dayFormat(task.daysSpent - task.daysEstimated)} ` +
                  `days beyond ` + workedStr;
            } else {
              workedStr = `worked ${dayFormat(task.daysSpent)} of ` + workedStr;
            }
          }
          return `*${index + 1}. ${task.title}* \n\t_\(${workedStr}\)_ ` +
              (task.state === STATE.COMPLETE ? 'COMPLETED' : '')
        }).join('\n');

        bot.reply(message, `This is what your list looks like right now:\n${taskList}`);
      } else {
        bot.reply(message, "You don't have any tasks. Use `add` to get started.");
       // We should add a callback here to start the single initializeTask conversation
       // initializeTask(askResponse, convo);
      }
    })
    .then(() => {
      if (callback) {
        callback();
      }
    });
}

function showScore(bot, message) {
  getTasksForSlackUser(message.user, { completeOnly: true }).then(tasks => {
    let completedTasksStr = tasks.map(task => {
      const score = computeScore([task]);
      const grade = computeGrade(score);
      const workedStr =
          `Done in ${dayFormat(task.daysSpent)} days. ` +
          `Estimated ${dayFormat(task.daysEstimated)} days. ` +
          `Score: ${score}% - ${grade}.`;
      return `*:white_check_mark: ${task.title}* \n\t_\(${workedStr}\)_`;
    }).join('\n');

    const score = computeScore(tasks);
    const grade = computeGrade(score);
    bot.reply(message,
        'Based on your completed tasks, your *tim3bot certified reliability score* is... ' +
        `:trophy:  *${score}% - ${grade}* :trophy:\n` +
        completedTasksStr);
  });
}

function computeScore(tasks) {
  let totals = tasks.reduce((totals, task, index) => {
    totals.totalEstimated += task.daysEstimated;
    totals.totalSpent += task.daysSpent;
    return totals;
  }, { totalEstimated: 0, totalSpent: 0 });
  if (totals.totalSpent === 0) {
    return 1;
  } else {
    return Math.round(totals.totalEstimated / totals.totalSpent * 100);
  }
}

function computeGrade(score) {
  let suffix = '';

  if (score % 10 > (10 / 6) || score === 100) {
    suffix = '+';
  } else if (score % 10 < (10 / 3)) {
    suffix = '-';
  }

  if (score >= 90) {
    return `A${suffix}`;
  } else if (score >= 80) {
    return `B${suffix}`;
  } else if (score >= 70) {
    return `C${suffix}`;
  } else if (score >= 60) {
    return `D${suffix}`;
  } else {
    return 'F';
  }
}

function showHelp(bot, message) {
  const helpMessage = `Ok! Get my sweet robotic cogs moving with these commands:
\t:clipboard: \`list\` displays all the tasks you have entered.
\t:heavy_plus_sign: \`add\` with a description and a day estimate creates a whole new task.
\t:bellhop_bell: \`checkin\` will begin a quick check-in session. Update and manage your tasks.
\t:trophy: \`score\` will display your TIM3BOT Certified Reliability Score.
\t:question: \`help\` ...and of course this is how you got here :smile:`;

  bot.reply(message, helpMessage);
}

function dayFormat(floatNumDays) {
  if (typeof floatNumDays !== 'number') { return ''; }
  let daysStr = floatNumDays.toString();
  let daysParts = daysStr.split('.');
  return daysParts.length === 1 ? daysStr :
      (daysParts[1].length === 1 ? floatNumDays.toFixed(1) : floatNumDays.toFixed(2));
}

// Data access.

function getUser(slackId) {
  return userRepo.selectOne({ query: { slackId: slackId } });
}

function getTasksForUser(user, { completeOnly = false, incompleteOnly = false } = {}) {
  if (completeOnly && incompleteOnly) {
    new Error('Both "completeOnly" and "incompleteOnly" options were set to true. ' +
        'No more than one may be true.')
  }
  let query = { userId: user.id };
  let excludeQuery;

  if (completeOnly) {
    query.state = STATE.COMPLETE;
  } else if (incompleteOnly) {
    query.state = STATE.INCOMPLETE;
  } else {
    excludeQuery = { state: STATE.ABANDONED };
  }
  return taskRepo.select({ query: query, excludeQuery: excludeQuery });
}

function getTasksForSlackUser(slackId, { completeOnly = false, incompleteOnly = false } = {}) {
  return getUser(slackId).then(user => getTasksForUser(user, arguments[1]));
}
