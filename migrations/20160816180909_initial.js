
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments('id');
      table.string('slackId');
    }),
    knex.schema.createTable('tasks', function (table) {
      table.increments('id');
      table.string('title');
      table.integer('userId').unsigned().index().references('id').inTable('users');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('tasks')
  ]);
};
