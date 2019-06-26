const db = require('./database/dbConfig');

module.exports = {
    add,
    find,
    findBy,
    findById,
    getUserLifts,
    update,
    remove
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

function getUserLifts(userId) {
    return db('lifts as l')
        .join('users as u', 'u.id', 'l.user_id')
        .select(
            'u.username',
            'l.id',
            'l.name',
            'l.sets',
            'l.weight',
            'l.repsPerSet',
            'l.bodyRegion',
            'l.created_at',
            'l.notes'
        )
        .where('l.user_id', userId);
}

function update(id, changes) {
    return db('lifts')
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

function remove(id) {
    return db('lifts')
        .where({ id })
        .first()
        .del();
}