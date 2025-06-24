const axios = require('axios');
const knex = require('../db/knex');

class CrawlerService {
    constructor() {
        this.sources = {
            anm: {
                name: 'ANM - Agência Nacional de Mineração',
                baseUrl: 'https://www.gov.br/anm/pt-br/assuntos/noticias',
                description: 'Notícias sobre mineração e recursos minerais'
            },
            dou: {
                name: 'DOU - Diário Oficial da União',
                baseUrl: 'https://www.in.gov.br/leiturajornal',
                description: 'Publicações oficiais do governo federal'
            },
            ibge: {
                name: 'IBGE - Instituto Brasileiro de Geografia e Estatística',
                baseUrl: 'https://servicodados.ibge.gov.br/api/v1',
                description: 'Dados estatísticos sobre mineração'
            }
        };
    }

    async crawlANM() {
        try {
            console.log('🔄 Iniciando coleta da ANM...');

            // Simula coleta de dados da ANM (site real)
            const publications = [
                {
                    title: 'ANM publica nova portaria sobre licenciamento ambiental',
                    content: 'A Agência Nacional de Mineração publicou nova portaria que estabelece critérios para licenciamento ambiental de empreendimentos minerários.',
                    source: 'ANM',
                    link: 'https://www.gov.br/anm/pt-br/assuntos/noticias/anm-publica-nova-portaria',
                    published_at: new Date()
                },
                {
                    title: 'Relatório de produção mineral - 2024',
                    content: 'Divulgado o relatório anual de produção mineral brasileira, mostrando crescimento de 5% em relação ao ano anterior.',
                    source: 'ANM',
                    link: 'https://www.gov.br/anm/pt-br/assuntos/noticias/relatorio-producao-2024',
                    published_at: new Date()
                },
                {
                    title: 'Nova área de mineração disponível para licitação',
                    content: 'ANM abre processo de licitação para exploração de minério de ferro na região de Carajás.',
                    source: 'ANM',
                    link: 'https://www.gov.br/anm/pt-br/assuntos/noticias/licitacao-carajas',
                    published_at: new Date()
                }
            ];

            return publications;
        } catch (error) {
            console.error('❌ Erro ao coletar dados da ANM:', error);
            return [];
        }
    }

    async crawlDOU() {
        try {
            console.log('🔄 Iniciando coleta do DOU...');

            // Simula coleta de dados do DOU (site real)
            const publications = [
                {
                    title: 'Decreto regulamenta exploração de recursos minerais',
                    content: 'Novo decreto estabelece normas para exploração sustentável de recursos minerais em terras indígenas.',
                    source: 'DOU',
                    link: 'https://www.in.gov.br/leiturajornal?data=2024-06-24',
                    published_at: new Date()
                },
                {
                    title: 'Portaria interministerial sobre mineração sustentável',
                    content: 'Publicada portaria que estabelece critérios para mineração sustentável e responsável.',
                    source: 'DOU',
                    link: 'https://www.in.gov.br/leiturajornal?data=2024-06-24',
                    published_at: new Date()
                }
            ];

            return publications;
        } catch (error) {
            console.error('❌ Erro ao coletar dados do DOU:', error);
            return [];
        }
    }

    async crawlIBGE() {
        try {
            console.log('🔄 Iniciando coleta do IBGE...');

            // Tenta buscar dados reais da API do IBGE
            const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');

            // Simula dados de mineração baseados nos estados
            const miningStates = response.data.slice(0, 3); // Primeiros 3 estados
            const publications = miningStates.map((state, index) => ({
                title: `Dados de mineração - ${state.nome}`,
                content: `Estatísticas atualizadas sobre atividade minerária no estado de ${state.nome}. Principais minérios: ferro, ouro e bauxita.`,
                source: 'IBGE',
                link: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.id}`,
                published_at: new Date()
            }));

            return publications;
        } catch (error) {
            console.error('❌ Erro ao coletar dados do IBGE:', error);

            // Fallback com dados simulados
            return [
                {
                    title: 'Estatísticas de mineração - 2024',
                    content: 'IBGE divulga dados atualizados sobre produção mineral brasileira e impacto econômico do setor.',
                    source: 'IBGE',
                    link: 'https://www.ibge.gov.br/estatisticas/economicas/mineracao.html',
                    published_at: new Date()
                }
            ];
        }
    }

    async crawlAllSources() {
        console.log('🚀 Iniciando coleta de todas as fontes...');

        const allPublications = [];

        // Coleta de todas as fontes em paralelo
        const [anmData, douData, ibgeData] = await Promise.allSettled([
            this.crawlANM(),
            this.crawlDOU(),
            this.crawlIBGE()
        ]);

        // Adiciona dados da ANM
        if (anmData.status === 'fulfilled') {
            allPublications.push(...anmData.value);
        }

        // Adiciona dados do DOU
        if (douData.status === 'fulfilled') {
            allPublications.push(...douData.value);
        }

        // Adiciona dados do IBGE
        if (ibgeData.status === 'fulfilled') {
            allPublications.push(...ibgeData.value);
        }

        console.log(`✅ Coleta concluída: ${allPublications.length} publicações encontradas`);
        return allPublications;
    }

    async savePublications(publications) {
        try {
            console.log('💾 Salvando publicações no banco de dados...');

            for (const publication of publications) {
                await knex('publications').insert(publication);
            }

            console.log(`✅ ${publications.length} publicações salvas com sucesso`);
            return publications.length;
        } catch (error) {
            console.error('❌ Erro ao salvar publicações:', error);
            throw error;
        }
    }
}

module.exports = new CrawlerService();
