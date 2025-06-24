const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('users').del();

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const joaoPasswordHash = await bcrypt.hash('joao123', 10);

  await knex('users').insert([
    {
      name: 'Admin',
      email: 'admin@minerdata.dev',
      password: adminPasswordHash,
      role: 'admin',
    },
    {
      name: 'João',
      email: 'joao@minerdata.dev',
      password: joaoPasswordHash,
      role: 'user',
    }
  ]);
};
