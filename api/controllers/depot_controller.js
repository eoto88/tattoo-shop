'use strict'

const { Depot, Client } = require('../models')
const {NOT_FOUND, createError} = require("../helpers/error_helper");
const {
    v4: uuidv4,
} = require('uuid');

const isExistingClient = (id_client, id_user) => {
    return Client.findByIdAndUserId(id_client, id_user).then(client => {
        if(client.length) {
            return client
        } else {
            throw createError({
                status: NOT_FOUND,
                message: 'Client not found'
            })
        }
    })
}

const getClientDepots = (req, res, next) => {
    const id_client = req.params.id_client
    const id_user = req.id_user

    isExistingClient(id_client, id_user)
        .then(function(client) {
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

        }).catch(next)
}

const postClientDepot = (req, res, next) => {
    const id_client = req.params.id_client
    const id_user = req.id_user

    isExistingClient(id_client, id_user)
        .then(function(client) {
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
        }).catch(next)
}

const putClientDepot = (req, res, next) => {
    const id_client = req.params.id_client
    const id_user = req.id_user

    isExistingClient(id_client, id_user)
        .then(function(client){
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
        })
        .catch(next)
}

const deleteClientDepot = (req, res, next) => {
    const id_client = req.params.id_client
    const id_user = req.id_user

    isExistingClient(id_client, id_user)
        .then(function(client) {
            const id = req.params.id

            Client.destroy(id)
                .then(function (depots) {
                    res.json({
                        ok: true,
                        message: 'Depot deleted',
                        depots,
                        id_user: req.id_user
                    })
                }).catch(next)
        })
        .catch(next)
}

module.exports = {
    getClientDepots,
    postClientDepot,
    putClientDepot,
    deleteClientDepot
}
