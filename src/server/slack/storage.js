const userRepo = require('../repos/user-repo');

function getUser(slackId, callback) {
  return userRepo
    .findUser({ query: slackId, select: 'name' })
    .then(user => (Object.assign({}, user, { id: slackId })))
    .then(user => {
      if (!user) {
        throw new Error(`No user found with Slack ID ${slackId}`);
      }

      callback(null, user);
    })
    .catch(callback);
}

function saveUser(data, callback) {
  return userRepo
    .upsertUser({
      data: { slackId: data.id },
    })
    .then(user => callback(null, user))
    .catch(callback);
}

function allUsers(callback) {
  return userRepo
    .listUsers()
    .then(users => (
      users.map(user => (Object.assign({}, user, { id: user.slackId })))
    ))
    .then(users => callback(null, users))
    .catch(callback);
}

function unimplemented() {
  throw new Error('not yet implemented');
}

const getTeam = unimplemented;
const saveTeam = unimplemented;
const allTeams = unimplemented;

const getChannel = unimplemented;
const saveChannel = unimplemented;
const allChannels = unimplemented;

module.exports = {
  teams: {
    get: getTeam,
    save: saveTeam,
    all: allTeams,
  },
  users: {
    get: getUser,
    save: saveUser,
    all: allUsers,
  },
  channels: {
    get: getChannel,
    save: saveChannel,
    all: allChannels,
  },
};
