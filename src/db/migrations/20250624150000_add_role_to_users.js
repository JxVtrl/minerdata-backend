/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('users', function (table) {
        table.enum('role', ['admin', 'user']).defaultTo('user').after('password');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('users', function (table) {
        table.dropColumn('role');
    });
}; 