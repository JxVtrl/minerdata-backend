const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const knex = require('../db/knex');

// Endpoint público para buscar publicações (sem autenticação)
router.get('/', async (req, res) => {
    try {
        const publications = await knex('publications')
            .select('id', 'title', 'content', 'source', 'link', 'published_at', 'created_at')
            .orderBy('created_at', 'desc')
            .limit(50);

        return res.status(200).json(publications);
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        return res.status(500).json({ message: 'Erro ao buscar publicações' });
    }
});

// Endpoint protegido (com autenticação) - mantido para compatibilidade
router.get('/protected', authMiddleware, async (req, res) => {
    try {
        const publications = await knex('publications')
            .select('id', 'title', 'content', 'source', 'link', 'published_at', 'created_at')
            .orderBy('created_at', 'desc')
            .limit(50);

        return res.status(200).json(publications);
    } catch (error) {
        console.error('Erro ao buscar publicações:', error);
        return res.status(500).json({ message: 'Erro ao buscar publicações' });
    }
});

module.exports = router;
