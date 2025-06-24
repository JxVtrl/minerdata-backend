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

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });

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
            .select('id', 'name', 'email', 'role')
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

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Verifica se os campos obrigatórios foram enviados
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Validação de senha (mínimo 6 caracteres)
    if (password.length < 6) {
        return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    try {
        // Verifica se o email já existe
        const existingUser = await knex('users').where({ email }).first();
        if (existingUser) {
            return res.status(400).json({ message: 'Este email já está em uso' });
        }

        // Hash da senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insere o novo usuário (por padrão, role será 'user')
        const [newUser] = await knex('users').insert({
            name,
            email,
            password: hashedPassword,
            role: 'user' // Por padrão, novos usuários são 'user'
        }).returning(['id', 'name', 'email', 'role']);

        // Gera o token
        const token = generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role
        });

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return res.status(500).json({ message: 'Erro no servidor' });
    }
});

module.exports = router;
