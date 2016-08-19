
exports.up = (knex, Promise) => (
  Promise.all([
    knex.schema.table('tasks', table => (
      table.dropColumn('daysSpent')
    ))
      .then(() => (
        knex.schema.table('tasks', table => (
          table.float('daysSpent').defaultTo(0).notNullable()
        ))
      )),
    knex.schema.table('tasks', table => (
      table.dropColumn('state')
    ))
      .then(() => (
        knex.schema.table('tasks', table => (
          table.string('state').defaultTo('unstarted').notNullable()
        ))
      )),
  ])
);

exports.down = () => {};
