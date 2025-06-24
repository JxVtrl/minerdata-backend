const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const crawlerService = require('../services/crawlerService');

router.post('/run', async (req, res) => {
    const io = req.app.get('io'); // Obtém a instância do Socket.IO
    let progress = 0;

    // Inicia o crawler em background
    const runCrawler = async () => {
        try {
            // Etapa 1: Iniciando coleta (20%)
            progress = 20;
            io.emit('progress', { percent: progress, message: 'Iniciando coleta de dados...' });

            // Etapa 2: Coletando dados da ANM (40%)
            progress = 40;
            io.emit('progress', { percent: progress, message: 'Coletando dados da ANM...' });
            const anmData = await crawlerService.crawlANM();

            // Etapa 3: Coletando dados do DOU (60%)
            progress = 60;
            io.emit('progress', { percent: progress, message: 'Coletando dados do DOU...' });
            const douData = await crawlerService.crawlDOU();

            // Etapa 4: Coletando dados do IBGE (80%)
            progress = 80;
            io.emit('progress', { percent: progress, message: 'Coletando dados do IBGE...' });
            const ibgeData = await crawlerService.crawlIBGE();

            // Etapa 5: Salvando dados no banco (100%)
            progress = 100;
            io.emit('progress', { percent: progress, message: 'Salvando dados no banco...' });

            // Combina todos os dados
            const allPublications = [...anmData, ...douData, ...ibgeData];

            // Salva no banco de dados
            if (allPublications.length > 0) {
                await crawlerService.savePublications(allPublications);
            }

            // Finaliza
            io.emit('done', {
                message: `Crawler finalizado com sucesso! ${allPublications.length} publicações coletadas.`,
                count: allPublications.length
            });

        } catch (error) {
            console.error('❌ Erro durante execução do crawler:', error);
            io.emit('error', {
                message: 'Erro durante execução do crawler: ' + error.message
            });
        }
    };

    // Executa o crawler em background
    runCrawler();

    return res.status(202).json({
        message: 'Crawler iniciado',
        sources: ['ANM', 'DOU', 'IBGE']
    });
});

// Endpoint para obter informações sobre as fontes
router.get('/sources', (req, res) => {
    const sources = [
        {
            id: 'anm',
            name: 'ANM - Agência Nacional de Mineração',
            description: 'Notícias e publicações oficiais sobre mineração',
            url: 'https://www.gov.br/anm/pt-br/assuntos/noticias'
        },
        {
            id: 'dou',
            name: 'DOU - Diário Oficial da União',
            description: 'Publicações oficiais do governo federal',
            url: 'https://www.in.gov.br/leiturajornal'
        },
        {
            id: 'ibge',
            name: 'IBGE - Instituto Brasileiro de Geografia e Estatística',
            description: 'Dados estatísticos sobre mineração',
            url: 'https://servicodados.ibge.gov.br/api/v1'
        }
    ];

    res.json(sources);
});

// Endpoint para estatísticas do crawler
router.get('/stats', async (req, res) => {
    try {
        const totalPublications = await knex('publications').count('* as total').first();
        const publicationsBySource = await knex('publications')
            .select('source')
            .count('* as count')
            .groupBy('source');

        res.json({
            total: totalPublications.total,
            bySource: publicationsBySource,
            lastUpdate: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

module.exports = router;
