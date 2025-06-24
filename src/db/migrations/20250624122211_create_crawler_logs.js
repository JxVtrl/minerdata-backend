/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('crawler_logs', (table) => {
        table.increments('id').primary();
        table.timestamp('started_at').defaultTo(knex.fn.now());
        table.timestamp('ended_at');
        table.string('status'); // ex: "iniciado", "concluído", "erro"
        table.text('message');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('crawler_logs');
};
