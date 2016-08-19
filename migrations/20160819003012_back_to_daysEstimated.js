exports.up = knex => (
  knex.schema.table('tasks', table => {
    table.renameColumn('estimate', 'daysEstimated')
  })
);

exports.down = knex => (
  knex.schema.table('tasks', table => {
    table.renameColumn('daysEstimated', 'estimate')
  })
);
