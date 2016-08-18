const userRepo = require('../repos/user-repo');

function getUser(slackId, callback) {
  return userRepo
    .selectOne({ query: { slackId }, select: 'name' })
    .then(user => (Object.assign({}, user, { id: slackId })))
    .then(user => {
      if (!user) {
        throw new Error(`No user found with Slack ID ${slackId}`);
      }

      callback(null, user);
    })
    .catch(callback);
}

function saveUser(user, callback) {
  return userRepo
    .upsert({
      data: { slackId: user.id },
    })
    .then(res => callback(null, res[0]))
    .catch(callback);
}

function allUsers(callback) {
  return userRepo
    .select()
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
