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
                .send({ 'username': 'spongebobby', 'password': 'pass' })
            expect(reqServer.status).toEqual(201)
        });

        it('/register returns 401, requires username and password', () => {
            return request(server)
                .post('/api/register')
                .send({ 'username': 'tom' })
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
});
