const db = require('./database/dbConfig');

module.exports = {
	add,
	find,
	findBy,
    findById,
    update
};

function find() {
	return db('users').select('id', 'username', 'password', 'email', 'age', 'height', 'weight');
}

function findBy(filter) {
	return db('users').where(filter);
}

async function add(user) {
	const [ id ] = await db('users').insert(user);

	return findById(id);
}

function findById(id) {
	return db('users').where({ id }).first();
}

function update(id, changes) {
    return db("users")
      .where({ id })
      .update(changes)
      .then(count => {
        if (count > 0) {
          return findById(id);
        } else {
          return null;
        }
      });

  }