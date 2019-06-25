
exports.seed = function(knex, Promise) {
  // the 00-cleanup.js seed already deleted all records
  // we just worry about seeding records in all other seeds
      // Inserts seed entries
      return knex('lifts').insert([
        { 
          user_id: 1, 
          name: 'Deadlift',
          sets: 3,
          weight: 110,
          repsPerSet: 5,
          bodyRegion: 'glutes, quads, trapezius',
          notes: 'was only able to perform 3 reps on my second set'
        },

        { 
          user_id: 1, 
          name: 'Bench press',
          sets: 3,
          weight: 30,
          repsPerSet: 5,
          bodyRegion: 'chest, shoulders, back',
          notes: 'increased weight to 40kg on my last rep'
        },

        { 
          user_id: 2, 
          name: 'Preacher curl',
          sets: 3,
          weight: 15,
          repsPerSet: 5,
          bodyRegion: 'brachialis',
          notes: 'completed all the sets without failure. will increase my wieght next time'
        }
      ]);
};
