'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Depot'
const tableName = 'depots'

// Properties that are allowed to be selected from the database for reading.
// (e.g., `password` is not included and thus cannot be selected)
const selectableProps = [
    'id',
    'id_user',
    'id_client',
    'date_depot',
    'montant',
    'etat',
    'date_etat',
    'note'
    // 'updated_at',
    // 'created_at'
]



module.exports = knex => {
    const guts = createGuts({
        knex,
        name,
        tableName,
        selectableProps
    })

    const findAllByIdClient = function(id_client) {
        return knex.select(selectableProps)
            .from(tableName)
            .where({ id_client })
            .timeout(guts.timeout)
    }

    return {
        ...guts,
        findAllByIdClient
    }
}
