const userRepo = require('../repos/user-repo');
const teamRepo = require('../repos/team-repo');
const channelRepo = require('../repos/channel-repo');

function getUser(slackId, callback) {
  return userRepo
    .selectOne({ query: { slackId }, select: '*' })
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
    .then(users => callback(null, users))
    .catch(callback);
}

function getTeam(slackId, callback) {
  return teamRepo
    .selectOne({ query: { slackId } })
    .then(team => {
      if (!team) {
        throw new Error(`No team found with Slack ID ${slackId}`);
      }

      callback(null, team);
    })
    .catch(callback);
}

function saveTeam(team, callback) {
  return teamRepo
    .upsert({
      data: { slackId: team.id },
    })
    .then(res => callback(null, res[0]))
    .catch(callback);
}

function allTeams(callback) {
  return teamRepo
    .select()
    .then(teams => callback(null, teams))
    .catch(callback);
}

function getChannel(slackId, callback) {
  return channelRepo
    .selectOne({ query: { slackId } })
    .then(channel => {
      if (!channel) {
        throw new Error(`No channel found with Slack ID ${slackId}`);
      }

      callback(null, channel);
    })
    .catch(callback);
}

function saveChannel(channel, callback) {
  return channelRepo
    .upsert({
      data: { slackId: channel.id },
    })
    .then(res => callback(null, res[0]))
    .catch(callback);
}

function allChannels(callback) {
  return channelRepo
    .select()
    .then(channels => callback(null, channels))
    .catch(callback);
}

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
