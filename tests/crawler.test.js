const request = require('supertest');
const app = require('../src/app');

describe('GET /crawler/run', () => {
    it('deve retornar uma mensagem de início do crawler', async () => {
        const res = await request(app).get('/crawler/run');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Crawler iniciado');
    });
});
