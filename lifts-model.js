const db = require('./database/dbConfig');

module.exports = {
    add,
    find,
    findBy,
    findById,
    update
};

function find() {
    return db('lifts').select('id', 'user_id', 'name', 'weight', 'repsPerSet', 'bodyRegion', 'created_at', 'notes');
}

function findBy(filter) {
    return db('lifts').where(filter);
}

async function add(lift) {
    const [id] = await db('lifts').insert(lift);

    return findById(id);
}

function findById(id) {
    return db('lifts').where({ id }).first();
}

function update(id, changes) {
    return db("lifts")
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