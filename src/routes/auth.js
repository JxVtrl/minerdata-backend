const knex = require('../db/knex');
const { generateToken, verifyToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Verifica se os campos foram enviados
    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    try {
        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = generateToken({ id: user.id, email: user.email });

        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
});

router.get('/verify', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Verifica se o header tem o formato correto
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Formato de autorização inválido' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' do início

    try {
        const decoded = verifyToken(token);

        // Busca informações completas do usuário no banco
        const user = await knex('users')
            .select('id', 'name', 'email')
            .where({ id: decoded.id })
            .first();

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Erro ao verificar token:', error.message);
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
});

module.exports = router;
