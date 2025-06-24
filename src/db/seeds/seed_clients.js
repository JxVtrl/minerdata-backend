exports.seed = async function (knex) {
    await knex('clients').del();

    await knex('clients').insert([
        {
            name: 'João Silva',
            email: 'joao.silva@mineracao.com.br',
            phone: '(11) 99999-9999',
            company: 'Mineração Silva Ltda',
            cnpj_cpf: '12.345.678/0001-90',
            address: 'Rua das Minerações, 123',
            city: 'São Paulo',
            state: 'SP',
            zip_code: '01234-567',
            status: 'active',
            notes: 'Cliente interessado em minério de ferro'
        },
        {
            name: 'Maria Santos',
            email: 'maria.santos@ouro.com.br',
            phone: '(21) 88888-8888',
            company: 'Ouro Santos S.A.',
            cnpj_cpf: '98.765.432/0001-10',
            address: 'Av. dos Minerais, 456',
            city: 'Rio de Janeiro',
            state: 'RJ',
            zip_code: '20000-000',
            status: 'active',
            notes: 'Especializada em mineração de ouro'
        },
        {
            name: 'Pedro Costa',
            email: 'pedro.costa@bauxita.com.br',
            phone: '(31) 77777-7777',
            company: 'Bauxita Costa Ltda',
            cnpj_cpf: '11.222.333/0001-44',
            address: 'Rua dos Metais, 789',
            city: 'Belo Horizonte',
            state: 'MG',
            zip_code: '30000-000',
            status: 'pending',
            notes: 'Aguardando aprovação de documentos'
        }
    ]);
}; 