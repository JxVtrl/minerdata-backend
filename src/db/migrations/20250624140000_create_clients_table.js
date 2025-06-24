/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('clients', function (table) {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable().unique();
        table.string('phone');
        table.string('company');
        table.string('cnpj_cpf');
        table.text('address');
        table.string('city');
        table.string('state');
        table.string('zip_code');
        table.enum('status', ['active', 'inactive', 'pending']).defaultTo('active');
        table.text('notes');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('clients');
}; 