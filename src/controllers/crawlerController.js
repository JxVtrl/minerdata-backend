const cheerio = require('cheerio');
const axios = require('axios');
const knex = require('../db/knex');

async function runCrawler(io) {
    try {
        const { data: html } = await axios.get('https://empresasdobrasil.com/cnae/mineracao'); // exemplo de fonte

        const $ = cheerio.load(html);
        const items = [];

        $('li a').each((i, el) => {
            const text = $(el).text().trim();
            const url = $(el).attr('href');
            items.push({ text, url });
        });

        for (let i = 0; i < items.length; i++) {
            const { text, url } = items[i];
            await knex('publications').insert({
                title: text,
                content: url,
                date: new Date()
            });

            const percent = Math.round((i + 1) / items.length * 100);
            io.emit('crawler-progress', { percent });
        }

        io.emit('crawler-done', { message: 'Crawler finalizado com sucesso.' });
    } catch (error) {
        io.emit('crawler-error', { message: 'Erro no crawler', error });
        console.error('Erro no crawler:', error);
    }
}

module.exports = { runCrawler };
