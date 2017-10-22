'use strict';

const path = require('path');

const knexDir = path.resolve(__dirname, '..', 'src/server', '.knex');


module.exports = {

    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'myuser',
            password: 'mypass',
            database: 'product_db',
            timezone: 'utc',
            charset: 'utf8'
        },
        debug: false,
        pool: {
            min: 2,
            max: 5
        },
        acquireConnectionTimeout: 10000,
        migrations: {
            directory: path.join(knexDir, 'migrations'),
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: path.join(knexDir, 'seeds')
        }
    },

    production: {
        client: 'mysql2',
        connection: {
            host: 'localhost', // Will use a secret file and read from file in prod
            user: 'myuser', // Will use a secret file and read from file in prod
            password: 'mypass', // Will use a secret file and read from file in prod
            database: 'product_db', // Will use a secret file and read from file in prod
            timezone: 'utc',
            charset: 'utf8'
        },
        debug: false,
        pool: {
            min: 4,
            max: 10
        },
        acquireConnectionTimeout: 10000,
        migrations: {
            directory: path.join(knexDir, 'migrations'),
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: path.join(knexDir, 'seeds')
        }
    }

};
