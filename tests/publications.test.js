const request = require('supertest');
const app = require('../src/app');
const { generateToken } = require('../src/utils/jwt');

describe('GET /publications', () => {
    const validToken = generateToken({ id: 1, email: 'admin@minerdata.dev' });

    it('deve permitir acesso com token válido', async () => {
        const res = await request(app)
            .get('/publications')
            .set('Authorization', `Bearer ${validToken}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve negar acesso sem token', async () => {
        const res = await request(app).get('/publications');

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Token não fornecido');
    });

    it('deve negar acesso com token inválido', async () => {
        const res = await request(app)
            .get('/publications')
            .set('Authorization', `Bearer token_invalido`);

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Token inválido ou expirado');
    });
});
