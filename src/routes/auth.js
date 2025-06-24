const express = require('express');
const bcrypt = require('bcrypt');
const knex = require('../db/knex');
const { generateToken } = require('../utils/jwt');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await knex('users').where({ email }).first();

    if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(401).json({ message: 'Senha incorreta' });

    const token = generateToken({ id: user.id, email: user.email });

    res.json({ token });
});

module.exports = router;
