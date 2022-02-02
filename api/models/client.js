'use strict'

const createGuts = require('../helpers/model-guts')

const name = 'Client'
const tableName = 'clients'

// Properties that are allowed to be selected from the database for reading.
// (e.g., `password` is not included and thus cannot be selected)
const selectableProps = [
    'id',
    'name',
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

    const findAllByUserId = function(id_user, query, limit, page) {
        const offset = (page * limit) -  limit
        return knex.select(selectableProps)
            .from(tableName)
            .where({ id_user })
            .modify((queryBuilder) => {
                if (query) {
                    queryBuilder.andWhere('name', 'like', `%${query}%`)
                }

                return queryBuilder;
            })
            .orderBy('name', 'asc')
            .limit(limit).offset(offset)
            .timeout(guts.timeout)
    }

    const countAllByUserId = function(id_user, query) {
        return knex.count('* as count')
            .from(tableName)
            .where({ id_user })
            .modify((queryBuilder) => {
                if (query) {
                    queryBuilder.andWhere('name', 'like', `%${query}%`)
                }

                return queryBuilder;
            })
            .timeout(guts.timeout)
            .first()
    }

    const findByIdAndUserId = function(id, id_user) {
        return knex.select(selectableProps)
            .from(tableName)
            .where({ id, id_user })
            .timeout(guts.timeout)
    }

    return {
        ...guts,
        findAllByUserId,
        countAllByUserId,
        findByIdAndUserId,
    }
}
