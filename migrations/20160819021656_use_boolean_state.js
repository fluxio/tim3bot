
exports.up = knex => (
  knex.schema.table('tasks', table => {
    table.dropColumn('state');
    table.boolean('completed').defaultTo(false).notNullable();
  })
);

exports.down = knex => (
  knex.schema.table('tasks', table => {
    table.string('state').defaultTo('in-progress').notNullable();
    table.dropColumn('completed');
  })
);
