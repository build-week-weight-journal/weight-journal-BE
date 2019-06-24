exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
		table.increments();
		table.string('username', 128).unique().notNullable();
        table.string('password', 128).notNullable();
        table.string('email', 128).notNullable();
        table.integer('age', 128).notNullable();
        table.integer('height', 128).notNullable();
        table.integer('weight', 128).notNullable();
	});
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};