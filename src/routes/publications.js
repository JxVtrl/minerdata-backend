const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, async (req, res) => {
    res.status(200).json([
        { id: 1, title: 'Publicação de Teste', content: 'Lorem ipsum', user: req.user.email }
    ]);
});

module.exports = router;
