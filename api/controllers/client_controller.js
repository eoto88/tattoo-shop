'use strict'

const { Client, Depot } = require('../models')
const {UNAUTHORIZED} = require("../helpers/error_helper");

const getClients = (req, res, next) => {
    const query = req.query.q

    if( req.id_user ) {
        Client.findAllByUserId(req.id_user, query)
            .then(function(clients) {
                Promise.all(clients.map(client => {
                    return Depot.findAllByIdClient(client.id).then(function(depots) {
                        client.depots = depots
                        return client
                    })
                })).then(clients => {
                    res.json({
                        ok: true,
                        message: 'Projects found',
                        clients,
                        id_user: req.id_user
                    })
                })
            })
            .catch(next)
    } else {
        res.status(UNAUTHORIZED).send({
            ok: false,
            message: 'Bad token'
        })
    }
}

const getClient  = (req, res, next) => {
    const id = req.params.id

    if( req.id_user ) {
        Client.findByIdAndUserId(id, req.id_user)
            .then(function(clients) {
                const client = clients[0]
                res.json({
                    ok: true,
                    message: 'Projects found',
                    client,
                    id_user: req.id_user
                })
            })
            .catch(next)
    }
}

module.exports = {
    getClients,
    getClient
}
