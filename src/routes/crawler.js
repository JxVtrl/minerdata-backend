const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/run', async (req, res) => {
    const startLog = await knex('crawler_logs')
        .insert({ status: 'iniciado', message: 'Crawler iniciado' })
        .returning('*');

    const logId = startLog[0].id;

    try {
        // Executa o crawler...
        // Simula demora
        await new Promise(resolve => setTimeout(resolve, 3000));

        await knex('crawler_logs')
            .where({ id: logId })
            .update({ ended_at: knex.fn.now(), status: 'concluído', message: 'Crawler finalizado com sucesso' });

        return res.json({ message: 'Crawler iniciado' });
    } catch (err) {
        await knex('crawler_logs')
            .where({ id: logId })
            .update({ ended_at: knex.fn.now(), status: 'erro', message: err.message });

        return res.status(500).json({ message: 'Erro ao executar crawler' });
    }
});

module.exports = router;
