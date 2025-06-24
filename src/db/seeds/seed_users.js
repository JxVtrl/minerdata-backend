/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  await knex('users').del();
  await knex('users').insert([
    { username: 'joao', password: '123456' },
    { username: 'admin', password: 'admin' }
  ]);
};
