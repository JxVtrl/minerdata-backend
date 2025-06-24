/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('publications', function (table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('content').notNullable();
        table.string('source'); // Ex: ANM, DOU
        table.string('link');
        table.date('published_at');
        table.timestamps(true, true);
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('publications');
};
