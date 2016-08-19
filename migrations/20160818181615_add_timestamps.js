exports.up = (knex, Promise) => (
  Promise.all([
    knex.schema.table('users', table => {
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    }),
    knex.schema.table('teams', table => {
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    }),
    knex.schema.table('channels', table => {
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    }),
    knex.schema.table('tasks', table => {
      table.dropColumn('dateCreated');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt').defaultTo(knex.fn.now());
    }),
  ])
);

exports.down = (knex, Promise) => (
  Promise.all([
    knex.schema.table('users', table => {
      table.dropColumn('createdAt');
      table.dropColumn('updatedAt');
    }),
    knex.schema.table('teams', table => {
      table.dropColumn('createdAt');
      table.dropColumn('updatedAt');
    }),
    knex.schema.table('channels', table => {
      table.dropColumn('createdAt');
      table.dropColumn('updatedAt');
    }),
    knex.schema.table('tasks', table => {
      table.date('dateCreated');
      table.dropColumn('createdAt');
      table.dropColumn('updatedAt');
    }),
  ])
);
