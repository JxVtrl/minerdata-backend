/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('logs', function (table) {
        table.increments('id').primary();
        table.string('type'); // Ex: 'crawler', 'api', 'error'
        table.text('message');
        table.jsonb('metadata'); // informações adicionais
        table.timestamps(true, true);
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('logs');
};
