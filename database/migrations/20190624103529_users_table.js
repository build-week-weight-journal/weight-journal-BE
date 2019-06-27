exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', (table) => {
		table.increments();
		table.string('username', 128).unique().notNullable();
        table.string('password', 128).notNullable();
        table.string('email', 128);
        table.integer('age', 128);
        table.string('height', 128);
        table.integer('weight', 128);
	});
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
