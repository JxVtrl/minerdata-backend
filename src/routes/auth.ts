import knex from '../db/knex';
import jwt from 'jsonwebtoken';
import { Router } from 'express';

const router = Router();


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Busca usuário no banco
    const user = await knex('users').where({ username }).first();

    // Verifica se existe e se a senha bate
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Cria token
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET!,
        { expiresIn: '2h' }
    );

    return res.json({ token });
});
