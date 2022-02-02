'use strict'

const { Client, Depot } = require('../models')
const {UNAUTHORIZED} = require("../helpers/error_helper");
const {v4: uuidv4} = require("uuid");

const getClients = (req, res, next) => {
    const query = req.query.q
    const limit = req.query._limit
    const page = req.query._page

    if( req.id_user ) {
        // TODO X-Total-Count

        Promise.all([
            Client.countAllByUserId(req.id_user, query),
            Client.findAllByUserId(req.id_user, query, limit, page)
        ]).then(([total, clients]) => {
            res.set("X-Total-Count", total.count)
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

const postClient  = (req, res, next) => {
    const id = uuidv4();
    const name = req.body.name

    if( req.id_user ) {
        Client.create({
            id,
            name,
            id_user: req.id_user
        }).then(function (depots) {
            res.json({
                ok: true,
                message: 'Client created',
                depots,
                id_user: req.id_user
            })
        }).catch(next)
    }
}

module.exports = {
    getClients,
    getClient,
    postClient
}
