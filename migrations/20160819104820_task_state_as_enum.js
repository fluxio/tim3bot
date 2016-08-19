
exports.up = knex => (
  knex.schema.table('tasks', table => {
    table.dropColumn('completed');
    table.enum('state', ['incomplete', 'complete', 'abandonded']).defaultTo('incomplete');
  })
);

exports.down = knex => (
  knex.schema.table('tasks', table => {
    table.bool('completed').defaultTo(false);
    table.dropColumn('state');
  })
);
