
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.string('name');
    }),
    knex.schema.table('tasks', function (table) {
      table.float('days_estimated');
      table.float('days_spent');
      table.date('date_created');
      table.string('state');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.dropColumn('name');
    }),
    knex.schema.table('tasks', function (table) {
      table.dropColumn('days_estimated');
      table.dropColumn('days_spent');
      table.dropColumn('date_created');
      table.dropColumn('state');
    }),
  ]);
};
