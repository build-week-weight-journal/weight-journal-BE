const request = require('supertest');

const server = require('./index.js');

describe('index.js', () => {
    it('should set testing environment', () => {
        expect(process.env.DB_ENV).toBe('testing');
    })

    describe('GET /', () =>{
        it('should return 200 OK', () => {
            return request(server)
            .get('/')
            .then(res => {
                expect(res.status).toBe(200);
            })
        })
        it('should return 200 OK using the squad', async () => {
            const res = await request(server).get('/');

            expect(res.status).toBe(200);
                })

                it('should return JSON', async () => {
                    const res = await request(server).get('/');

                    expect(res.type).toBe('application/json')
                })

                it('should return {api: up} in body', async() => {
                    const res = await request(server).get('/');

                    expect(res.body).toEqual({api: 'up'})
                })
    })
}) 