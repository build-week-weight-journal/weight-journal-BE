exports.up = function(knex, Promise) {
  return knex.schema.createTable('lifts', table => {
    table.increments();
    //foreign key linking exercises to users.
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.string('name', 128).notNullable();
    table.integer('sets', 128).notNullable();
    table.integer('weight', 128).notNullable();
    table.integer('repsPerSet', 128).notNullable();
    table.string('bodyRegion', 128).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.text('notes').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('lifts');
};
