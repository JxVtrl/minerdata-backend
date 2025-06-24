const bcrypt = require('bcrypt');

exports.seed = async function (knex) {
  await knex('users').del();

  const passwordHash = await bcrypt.hash('admin123', 10);

  await knex('users').insert([
    {
      name: 'Admin',
      email: 'admin@minerdata.dev',
      password: passwordHash,
    },
  ]);
};
