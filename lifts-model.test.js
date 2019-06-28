const db = require('./database/dbConfig');
const Lifts = require('./lifts-model');

describe('lifts-model', () => {
  afterEach(async () => {
    await db('lifts').truncate();
  })

  describe('find', () => {
    it('returns list of all Lifts in db', async () => {
      await Lifts.add({
        user_id: 1,
        name: 'Deadlift',
        weight: 100 ,
        sets: '3' ,
        repsPerSet: 10,
        bodyRegion: 'lower body',
        created_at: '2019-06-26 07:45:24',
        notes: 'love it'
      });

      await Lifts.add({
        user_id: 2,
        name: 'Bench press',
        weight: 100 ,
        sets: '3' ,
        repsPerSet: 10,
        bodyRegion: 'chest',
        created_at: '2019-06-26 07:45:24',
        notes: 'love it'
      })
    })
  })
/*
  describe('findById', () => {
    it('returns a specific lift by ID', async () => {
      await Lifts.add({
        user_id: 3,
        name: 'Leg press',
        weight: 100 ,
        sets: '3' ,
        repsPerSet: 10,
        bodyRegion: 'legs',
        created_at: '2019-06-26 07:45:24',
        notes: 'love it'
      });

      const user2 = await Lifts.add({
        user_id: 4,
        name: 'Lateral pulldown',
        weight: 30,
        sets: '3' ,
        repsPerSet: 10,
        bodyRegion: 'back, delts',
        created_at: '2019-06-26 07:45:24',
        notes: 'love it'
      })

      const foundLift = await Lifts.findById(2);
      expect(foundLift[0]).toEqual({
        user_id: 4,
        name: 'Lateral pulldown',
        weight: 30,
        sets: '3' ,
        repsPerSet: 10,
        bodyRegion: 'back, delts',
        created_at: '2019-06-26 07:45:24',
        notes: 'love it'
      });
    })
  })

  describe('add', () => {
    it('adds new lift to db', async () => {
      const newLift = await Lifts.add({
        user_id: 5,
        name: 'Cable crunch',
        weight: 25,
        sets: '5' ,
        repsPerSet: 15,
        bodyRegion: 'abs',
        created_at: '2019-06-26 07:45:24',
        notes: 'love it'
        });
      expect(newLift[0]).toEqual({
        id: 4,
        user_id: 5,
        name: 'Cable crunch',
        weight: 25,
        sets: '5' ,
        repsPerSet: 15,
        bodyRegion: 'abs',
        created_at: '2019-06-26 07:45:24',
        notes: 'love it'
        })
      const allLifts = await Lifts.findAll();
      expect(allLifts).toHaveLength(1)
      })
    })
*/
})
