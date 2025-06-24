const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const adminAuth = require('../middlewares/adminAuth');

// Aplicar middleware de admin em todas as rotas de clientes
router.use(adminAuth);

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '' } = req.query;
        const offset = (page - 1) * limit;

        let query = knex('clients');

        // Aplicar filtros
        if (search) {
            query = query.where(function () {
                this.where('name', 'ilike', `%${search}%`)
                    .orWhere('email', 'ilike', `%${search}%`)
                    .orWhere('company', 'ilike', `%${search}%`)
                    .orWhere('cnpj_cpf', 'ilike', `%${search}%`);
            });
        }

        if (status) {
            query = query.where('status', status);
        }

        // Buscar total de registros
        const totalQuery = query.clone();
        const total = await totalQuery.count('* as count').first();

        // Buscar dados paginados
        const clients = await query
            .select('*')
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);

        res.json({
            clients,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total.count,
                pages: Math.ceil(total.count / limit)
            }
        });
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ message: 'Erro ao buscar clientes' });
    }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await knex('clients').where({ id }).first();

        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        res.json(client);
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ message: 'Erro ao buscar cliente' });
    }
});

// Criar novo cliente
router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            company,
            cnpj_cpf,
            address,
            city,
            state,
            zip_code,
            status = 'active',
            notes
        } = req.body;

        // Validações básicas
        if (!name || !email) {
            return res.status(400).json({ message: 'Nome e email são obrigatórios' });
        }

        // Verificar se email já existe
        const existingClient = await knex('clients').where({ email }).first();
        if (existingClient) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const [client] = await knex('clients')
            .insert({
                name,
                email,
                phone,
                company,
                cnpj_cpf,
                address,
                city,
                state,
                zip_code,
                status,
                notes
            })
            .returning('*');

        res.status(201).json(client);
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        res.status(500).json({ message: 'Erro ao criar cliente' });
    }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            email,
            phone,
            company,
            cnpj_cpf,
            address,
            city,
            state,
            zip_code,
            status,
            notes
        } = req.body;

        // Verificar se cliente existe
        const existingClient = await knex('clients').where({ id }).first();
        if (!existingClient) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Verificar se email já existe (exceto para o próprio cliente)
        if (email && email !== existingClient.email) {
            const emailExists = await knex('clients').where({ email }).whereNot({ id }).first();
            if (emailExists) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }
        }

        const [updatedClient] = await knex('clients')
            .where({ id })
            .update({
                name,
                email,
                phone,
                company,
                cnpj_cpf,
                address,
                city,
                state,
                zip_code,
                status,
                notes
            })
            .returning('*');

        res.json(updatedClient);
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ message: 'Erro ao atualizar cliente' });
    }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar se cliente existe
        const existingClient = await knex('clients').where({ id }).first();
        if (!existingClient) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        await knex('clients').where({ id }).del();

        res.json({ message: 'Cliente deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        res.status(500).json({ message: 'Erro ao deletar cliente' });
    }
});

// Estatísticas dos clientes
router.get('/stats/summary', async (req, res) => {
    try {
        const total = await knex('clients').count('* as count').first();
        const byStatus = await knex('clients')
            .select('status')
            .count('* as count')
            .groupBy('status');

        res.json({
            total: total.count,
            byStatus,
            lastUpdate: new Date().toISOString()
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ message: 'Erro ao buscar estatísticas' });
    }
});

module.exports = router; 