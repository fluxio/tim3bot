
exports.up = function(knex) {
  return knex.schema.table('tasks', table => {
    table.renameColumn('days_estimated', 'daysEstimated');
    table.renameColumn('days_spent', 'daysSpent');
    table.renameColumn('date_created', 'dateCreated');
  });
};

exports.down = function(knex) {
  return knex.schema.table('tasks', table => {
    table.renameColumn('daysEstimated', 'days_estimated');
    table.renameColumn('daysSpent', 'days_spent');
    table.renameColumn('dateCreated', 'date_created');
  });
};
