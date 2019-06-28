exports.seed = function(knex, Promise) {
  // the 00-cleanup.js seed already deleted all records
  // we just worry about seeding records in all other seeds
  // Inserts seed entries
  return knex('lifts').insert([
    {
      user_id: 1,
      name: 'Deadlift',
      sets: 2,
      weight: 150,
      repsPerSet: 3,
      bodyRegion: 'glutes, quads, trapezius',
      notes: 'was only able to perform 2 reps on my second set',
      src_url:
        'https://cdn1.coachmag.co.uk/sites/coachmag/files/styles/insert_main_wide_image/public/2017/08/romanian-deadlift.jpg?itok=DHmLJeOb'
    },

    {
      user_id: 1,
      name: 'Bench press',
      sets: 3,
      weight: 80,
      repsPerSet: 8,
      bodyRegion: 'chest, shoulders, triceps',
      notes: 'decreased weight to 70kg on my last set',
      src_url: 'http://ignorelimits.com/wp-content/uploads/2017/08/How-to-Barbell-Bench-Press.jpg'
    },

    {
      user_id: 1,
      name: 'Preacher curl',
      sets: 3,
      weight: 35,
      repsPerSet: 10,
      bodyRegion: 'biceps, brachialis',
      notes: 'completed all the sets without failure. will increase my wieght next time',
      src_url: 'https://mk0ifpafitnessc1bmd8.kinstacdn.com/app/uploads/2017/11/shutterstock_218445529.jpg'
    },
    {
      user_id: 1,
      name: 'lateral raise',
      sets: 4,
      weight: 15,
      repsPerSet: 5,
      bodyRegion: 'lateral deltoids',
      notes: 'Point thumbs down',
      src_url: 'https://pubhd.in/wp-content/uploads/2018/11/dumbbell-lateral-raise.jpg'
    },
    {
      user_id: 2,
      name: 'Pec fly',
      sets: 4,
      weight: 60,
      repsPerSet: 8,
      bodyRegion: 'chest',
      notes: 'Focus on getting full range of motion',
      src_url: 'http://ignorelimits.com/wp-content/uploads/2016/08/How-to-pec-dec-fly-Copy.jpg'
    }
  ]);
};
