const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.post('/run', async (req, res) => {
    const io = req.app.get('io'); // Obtém a instância do Socket.IO
    let progress = 0;

    // Simula execução do crawler com progresso
    const interval = setInterval(async () => {
        progress += 20;

        // Emite progresso para todos os clientes conectados
        io.emit('progress', { percent: progress });

        // A cada etapa, salva um dado simulado no banco
        await knex('publications').insert({
            title: `Publicação ${progress}%`,
            content: `Conteúdo da publicação coletada com progresso de ${progress}%`,
            source: 'ANM',
            link: 'https://exemplo.gov.br/fake',
            published_at: new Date()
        });

        // Finaliza
        if (progress >= 100) {
            clearInterval(interval);
            io.emit('done', { message: 'Crawler finalizado com sucesso!' });
        }
    }, 500);

    return res.status(202).json({ message: 'Crawler iniciado' });
});

module.exports = router;
