const axios = require('axios');

async function fetchMiningData(limit = 20) {
    try {
        const response = await axios.get('https://dados.gov.br/api/3/action/datastore_search', {
            params: {
                resource_id: '6f8e079d-7a27-413f-90fa-7f5e8b83efdb', // ID real de um conjunto sobre mineração
                limit
            }
        });

        const records = response.data.result.records;

        // Mapeia os dados que interessam
        return records.map(record => ({
            id: record._id,
            titular: record.titular || 'Desconhecido',
            tipo: record.tipo_de_atividade || 'N/A',
            fase: record.fase_do_processo || 'N/A',
            municipio: record.municipio || 'N/A',
            uf: record.uf || 'N/A',
            data_inicio: record.data_inicio || null
        }));
    } catch (error) {
        console.error('Erro ao buscar dados de mineração:', error.message);
        throw new Error('Falha ao coletar dados');
    }
}

module.exports = { fetchMiningData };
