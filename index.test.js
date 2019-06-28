const request = require('supertest');
const server = require('./index.js');
const db = require('./database/dbConfig');

/** Environment setup test **/
describe('** Testing environment setup **', () => {
  it('should set testing environment', () => {
    expect(process.env.DB_ENV).toBe('testing');
  });
});

/** Authorization test **/
describe('** Authorization testing **', () => {
  describe('/REGISTER', () => {
    afterEach(async () => {
      await db('users').truncate();
    });

    it('/register returns 201, success', async () => {
      const reqServer = await request(server)
        .post('/api/register')
        .send({ username: 'spongebobby', password: 'pass' });
      expect(reqServer.status).toEqual(201);
    });

    it('/register returns 401, requires username and password', () => {
      return request(server)
        .post('/api/register')
        .send({ username: 'tom' })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });

    it('/register returns a token', () => {
      return request(server)
        .post('/api/register')
        .send({ username: 'matt', password: 'pass' })
        .then(res => {
          expect(res.body).toHaveProperty('token');
        });
    });
  });

  describe('/LOGIN', () => {
    it('/login returns a 200, success with valid credentials', async () => {
      await request(server)
        .post('/api/register')
        .send({ username: 'patty', password: 'pass' });

      const expected = await request(server)
        .post('/api/login')
        .send({ username: 'patty', password: 'pass' });
      expect(expected.status).toBe(200);
    });

    it('/login returns a 401, with invalid credentials', () => {
      return request(server)
        .post('/api/login')
        .send({ username: 'austin', password: 'pass' })
        .then(res => {
          expect(res.status).toBe(401);
        });
    });
  });

  /** Users test **/
  describe('/USERS', () => {
    let token;

    beforeAll(done => {
      request(server)
        .post('/api/register')
        .send({
          username: 'patt',
          password: 'pass'
        })
        .end((err, response) => {
          token = response.body.token; // save the token!
          //console.log(token)
          done();
        });
    });

    describe('GET /api/users', () => {
      it('returns a 200, OK', () => {
        return request(server)
          .get('/api/users/')
          .set('Authorization', `${token}`)
          .then(response => {
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
          });
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return JSON using done callback', async () => {
        // using the done callback
        return request(server)
          .get('/api/users/1')
          .set('Authorization', `${token}`)
          .then(response => {
            expect(response.status).toBe(200);
          });
      });
    });

    describe('PUT /api/users/:id', () => {
      it('returns a 200, 0k on successful update', () => {
        return request(server)
          .put('/api/users/2')
          .set('Authorization', `${token}`)
          .send({
            username: 'pattxx',
            password: 'pass'
          })
          .then(response => {
            expect(response.status).toBe(200);
          });
      });

      it('returns a 404, bad request on invalid update id', async () => {
        await request(server)
          .post('/api/register')
          .send({ username: 'patt', password: 'pass' });

        const expected = await request(server)
          .put('/users/3')
          .send({ username: 'pattx', password: 'pass' });
        expect(expected.status).toBe(404);
      });

      it('returns a 404, bad request on update to incomplete endpoint', async () => {
        await request(server)
          .post('/api/register')
          .send({ username: 'patt', password: 'pass' });

        const expected = await request(server)
          .put('/api/users')
          .send({ username: 'pattx', password: 'pass' });
        expect(expected.status).toBe(404);
      });
    });
    describe('DELETE /api/users/:id', () => {
        it('returns a 200, 0k on successful deletion', () => {
          return request(server)
            .delete('/api/users/2')
            .set('Authorization', `${token}`)
            .then(response => {
              expect(response.status).toBe(200);
            });
        });
    });

  });

  /** Lifts test **/
  describe('/LIFTS', () => {
    let token;

    beforeAll(done => {
      request(server)
        .post('/api/login')
        .send({
          username: 'patt',
          password: 'pass'
        })
        .end((err, response) => {
          token = response.body.token; // save the token!
          done();
        });
    });
    
    describe('GET /api/lifts', () => {
      it('returns a 200, OK', () => {
        return request(server)
          .get('/api/lifts')
          .set('Authorization', `${token}`)
          .then(response => {
            expect(response.status).toBe(200);
            expect(response.type).toBe('application/json');
          });
      });
    });

    describe('GET /api/lifts/:id', () => {
        it('returns a 200, OK', async () => {
            await request(server)
              .post('/api/lifts/')
              .send({
                    user_id: 1,
                    name: 'Bench press',
                    sets: 3,
                    weight: 110,
                    repsPerSet: 5,
                    bodyRegion: 'chest',
                    created_at: '2019-06-26 07:45:24',
                    notes: 'was only able to perform 3 reps on my second set'
              });
              const expected = await request(server).get('/api/lifts/1');
              expect(expected.status).toBe(200);        
              });
        });


    describe('GET /api/users/:id/lifts', () => {
        it('returns a 200, OK', async () => {
            await request(server)
              .post('/api/lifts/')
              .send({
                    user_id: 1,
                    name: 'Lateral pulldown',
                    sets: 3,
                    weight: 110,
                    repsPerSet: 5,
                    bodyRegion: 'back',
                    created_at: '2019-06-26 07:45:24',
                    notes: 'was only able to perform 3 reps on my second set'
              });

              const expected = await request(server).get('/api/users/1/lifts');
              expect(expected.status).toBe(200);        
              });
        });

        describe('GET /api/users/:id/liftsearch', () => {
            it('returns a 200, OK', async () => {
                await request(server)
                  .post('/api/lifts/')
                  .send({
                        user_id: 1,
                        name: 'Lateral pulldown',
                        sets: 3,
                        weight: 110,
                        repsPerSet: 5,
                        bodyRegion: 'back',
                        created_at: '2019-06-26 07:45:24',
                        notes: 'was only able to perform 3 reps on my second set'
                  });
    
                  
              const expected = await request(server).get('/api/users/1/liftsearch')
              .send({ name: 'Lateral pulldown '})
                  expect(expected.status).toBe(200);        
                  });
            });

            describe('POST/', () => {
                it('returns a 201', async () => {
                  const expected = await request(server)
                    .post('/api/lifts')
                    .send({
                        user_id: 1,        
                        name: 'Squat',
                        sets: 3,
                        weight: 150,
                        repsPerSet: 8,
                        bodyRegion: 'compound',
                        created_at: '2019-06-26 07:45:24',
                        notes: 'was only able to perform 7 reps on my second set'
                    });
                  expect(expected.status).toBe(201);
                });
              });   

    describe('PUT /api/lifts/:id', () => {
        it('returns a 200, 0k on successful update', async () => {
            await request(server)
              .post('/api/lifts')
              .send({
                user_id: 1,        
                name: 'Cardio',
                sets: 3,
                weight: 110,
                repsPerSet: 5,
                bodyRegion: 'compound',
                created_at: '2019-06-26 07:45:24',
                notes: 'was only able to perform 3 reps on my second set'
              });
      
            const expected = await request(server)
              .put('/api/lifts/1')
              .send({
                user_id: 1,        
                name: 'Lat pulldown',
                sets: 3,
                weight: 110,
                repsPerSet: 5,
                bodyRegion: 'back',
                created_at: '2019-06-26 07:45:24',
                notes: 'was only able to perform 3 reps on my second set'
              });
            expect(expected.status).toBe(200);
          });
        });
        
        describe('DELETE /api/lifts/:id', () => {
            it('returns a 200, OK', async () => {
              await request(server)
                .delete('/api/lifts/2')
                .then(res => {
                  expect(res.status).toBe(200);
                });
            });
          });

  });

});
