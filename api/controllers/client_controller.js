'use strict'

const {Client, Depot} = require('../models')
const {UNAUTHORIZED, createError, NOT_FOUND} = require("../helpers/error_helper");
const {v4: uuidv4} = require("uuid");

const getClients = (req, res, next) => {
    const query = req.query.q
    const limit = req.query._limit
    const page = req.query._page
    const depotsEtat = req.query.depotsEtat

    if (req.id_user) {
        Promise.all([
            Client.countAllByUserId(req.id_user, {
                query,
                depotsEtat
            }),
            Client.findAllByUserId(req.id_user, {
                query,
                limit,
                page,
                depotsEtat
            })
        ]).then(([total, clients]) => {
            res.set("X-Total-Count", total.count)
            Promise.all(clients.map(client => {
                return Depot.findAllByIdClient(client.id).then(function (depots) {
                    client.waitingDepotsCount = depots.filter(depot => depot.etat ==  "En attente").length;
                    client.depotsCount = depots.length;
                    client.depots = depots;
                    return client;
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

const getClient = (req, res, next) => {
    const id = req.params.id

    if (req.id_user) {
        Client.findByIdAndUserId(id, req.id_user)
            .then(function (clients) {
                const client = clients[0]
                res.json({
                    ok: true,
                    message: 'Client found',
                    client,
                    id_user: req.id_user
                })
            })
            .catch(next)
    }
}

const postClient = (req, res, next) => {
    const id = uuidv4();
    const name = req.body.name

    if (req.id_user) {
        Client.create({
            id,
            name,
            id_user: req.id_user
        }).then(function (depots) {
            res.json({
                ok: true,
                message: 'Client created',
                newId: id,
                id_user: req.id_user
            })
        }).catch(next)
    }
}

const putClient = (req, res, next) => {
    const id = req.params.id
    const name = req.body.name

    if (req.id_user) {
        Client.update(id, {
            name,
            id_user: req.id_user
        }).then(function (response) {
            if( response === 0) {
                throw createError({
                    status: NOT_FOUND,
                    message: 'Client not found'
                })
            }
            res.json({
                ok: true,
                message: 'Client modified',
                response,
                id_user: req.id_user
            })
        }).catch(next)
    }
}

const deleteClient = (req, res, next) => {
    const id = req.params.id

    if (req.id_user) {
        Client.deleteClientAndDepots(id)
            .then(function (depots) {
                res.json({
                    ok: true,
                    message: 'Client deleted',
                    depots,
                    id_user: req.id_user
                })
            }).catch(next)
    }
}

module.exports = {
    getClients,
    getClient,
    postClient,
    putClient,
    deleteClient
}
