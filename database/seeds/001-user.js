
exports.seed = function(knex, Promise) {
  // the 00-cleanup.js seed already deleted all records
  // we just worry about seeding records in all other seeds
      // Inserts seed entries
      return knex('users').insert([
        { username: 'Bob', 
          password: 'test',
          email: 'bob@test.com',
          age: 21,
          height: '6ft 2in',
          weight: 173
        },
        { username: 'Charlie', 
          password: 'test',
          email: 'charlie@test.com',
          age: 23,
          height: '5ft 3in',
          weight: 173
        }
      ]);
};
