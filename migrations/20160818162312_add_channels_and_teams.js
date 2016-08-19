
exports.up = (knex, Promise) => (
  Promise.all([
    knex.schema.createTable('channels', table => {
      table.increments('id').primary();
      table.string('slackId').unique();
    }),
    knex.schema.createTable('teams', table => {
      table.increments('id').primary();
      table.string('slackId').unique();
    }),
  ])
);

exports.down = (knex, Promise) => (
  Promise.all([
    knex.schema.dropTable('channels'),
    knex.schema.dropTable('teams'),
  ])
);
