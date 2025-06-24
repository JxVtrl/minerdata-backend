const request = require('supertest');
const app = require('../src/app');

describe('POST /auth/login', () => {
    it('deve retornar um token JWT para credenciais válidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@minerdata.dev',
                password: 'admin123'
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('deve retornar 401 para credenciais inválidas', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'admin@minerdata.com',
                password: 'senhaerrada'
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Credenciais inválidas');
    });
});
