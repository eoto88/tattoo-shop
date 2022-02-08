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

    const findAllByUserId = function(id_user, filters) {
        const limit = filters.limit ? filters.limit : 25
        const page = filters.page ? filters.page : 1
        const offset = (page * limit) -  limit
        const depotsEtat = filters.depotsEtat

        return knex.select('clients.id', 'clients.name')
            .from(tableName)
            .modify((queryBuilder) => {
                if (filters.query) {
                    queryBuilder.andWhere('name', 'like', `%${filters.query}%`)
                }
                if(depotsEtat) {
                    queryBuilder.join('depots', 'depots.id_client', 'clients.id')
                    queryBuilder.andWhere({ 'depots.etat': depotsEtat })
                    queryBuilder.groupBy('depots.id_client')
                }

                return queryBuilder;
            })
            .andWhere({ 'clients.id_user': id_user })
            .orderBy('name', 'asc')
            .limit(limit).offset(offset)
            .timeout(guts.timeout)
    }

    const countAllByUserId = function(id_user, filters) {
        const depotsEtat = filters.depotsEtat

        return knex.count('* as count')
            .from(tableName)
            .modify((queryBuilder) => {
                if (filters.query) {
                    queryBuilder.andWhere('name', 'like', `%${filters.query}%`)
                }
                if(depotsEtat) {
                    queryBuilder.join('depots', 'depots.id_client', 'clients.id')
                    queryBuilder.andWhere({ 'depots.etat': depotsEtat })
                    queryBuilder.groupBy('depots.id_client')
                }

                return queryBuilder;
            })
            .andWhere({ 'clients.id_user': id_user })
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
