'use strict'

const { Depot, Client } = require('../models')
const {NOT_FOUND, createError} = require("../helpers/error_helper");
const {
    v4: uuidv4,
} = require('uuid');

const getClientDepots = (req, res, next) => {
    const id_client = req.params.id_client

    Client.findById(id_client)
        .then(function(client) {
            if(client.length === 0) {
                next(createError({
                    status: NOT_FOUND,
                    message: 'Client not found'
                }))
            } else {
                Depot.findAllByIdClient(id_client)
                    .then(function(depots) {
                        res.json({
                            ok: true,
                            message: 'Client\'s depots found',
                            depots,
                            id_user: req.id_user
                        })
                    })
                    .catch(next)
            }

        }).catch(next)
}

const postClientDepot = (req, res, next) => {
    const id_client = req.params.id_client

    Client.findById(id_client)
        .then(function(client) {
            if(client.length === 0) {
                next(createError({
                    status: NOT_FOUND,
                    message: 'Client not found'
                }))
            } else {
                const id = uuidv4();
                const date_depot = req.body.date_depot
                const montant = req.body.montant
                const etat = req.body.etat
                const note = req.body.note

                Depot.create({
                    id,
                    id_user: req.id_user,
                    id_client,
                    date_depot,
                    montant,
                    etat,
                    note
                }).then(function(depots) {
                    res.json({
                        ok: true,
                        message: 'Depot created',
                        depots,
                        id_user: req.id_user
                    })
                }).catch(next)
            }

        }).catch(next)
}

const putClientDepot = (req, res, next) => {
    const id_client = req.params.id_client
    // Find client first

    const id = req.params.id
    // const id = req.body.id
    const date_depot = req.body.date_depot
    const montant = req.body.montant
    const etat = req.body.etat
    const note = req.body.note

    Depot.update(id, {
        id_user: req.id_user,
        id_client,
        date_depot,
        montant,
        etat,
        note
    }).then(function(depots) {
        res.json({
            ok: true,
            message: 'Depot modified',
            depots,
            id_user: req.id_user
        })
    }).catch(next)
}

const deleteClientDepot = (req, res, next) => {
    const id_client = req.params.id_client
    // Find client first

    const id = req.params.id

    if (req.id_user) {
        Client.destroy(id)
            .then(function (depots) {
                res.json({
                    ok: true,
                    message: 'Depot deleted',
                    depots,
                    id_user: req.id_user
                })
            }).catch(next)
    }
}

module.exports = {
    getClientDepots,
    postClientDepot,
    putClientDepot,
    deleteClientDepot
}
