const express = require('express');
const knex = require('../db/knex');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const publications = await knex('publications').select();
    res.json(publications);
});

module.exports = router;
