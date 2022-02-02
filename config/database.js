'use strict'

const moment = require('moment');

const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host : process.env.DB_HOST,
        port : process.env.DB_PORT,
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : 'tattoo_shop',
        dateStrings: [
            'DATE',
            'DATETIME'
        ]
    }
})

module.exports = knex
