const request = require('supertest');
const db = require('./database/dbConfig');
const Users = require('./users-model');

describe('users-model', () => {
  afterEach(async () => {
    await db('users').truncate();
  })

  describe('find', () => {
    it('returns list of all users in db', async () => {
      await Users.add({
        username: 'Patrick',
        password: 'test',
      });

      await Users.add({
        username: 'Mrs Puff',
        password: 'test',
      })

      //const allUsers = await Users.find();
      //expect(allUsers).toHaveLength(3);
    })
  })

  describe('findBy', () => {
    it('returns users matching filter', async () => {


      await Users.add({
        username: 'Mario',
        password: 'test',
        age: 100,
        email: 'mario@test.com',
        height: '2ft 3in',
        weight: 119
      });

      const user2 = await Users.add({
        username: 'Bowser',
        password: 'test',
        age: 200,
        email: 'bowser@test.com',
        height: '3ft 5in',
        weight: 300

      })

      const filteredUser = await Users.findBy({ username: 'Bowser' }).first()
      expect(filteredUser).toEqual({
        id: 2,
        username: 'Bowser',
        password: 'test',
        age: 200,
        email: 'bowser@test.com',
        height: '3ft 5in',
        weight: 300
      });
    })
  })

  describe('add', () => {
    it('adds user to db', async () => {
      const newUser = await Users.add({
        username: 'Yoshi',
        password: 'test'
      });
      expect(newUser[0]).toEqual({
        id: 1,
        username: 'Yoshi',
        password: 'test'
      })
      const allUsers = await Users.findAll();
      expect(allUsers).toHaveLength(1)
    })
  })
})
