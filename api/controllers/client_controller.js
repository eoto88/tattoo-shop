'use strict'

const { Client } = require('../models')
const {GENERIC_ERROR} = require("../helpers/error_helper");

const getClients = (req, res, next) => {
    const query = req.query.q

    if( req.id_user ) {
        Client.findByUserId(req.id_user, query)
            .then(clients => res.json({
                ok: true,
                message: 'Projects found',
                clients,
                id_user: req.id_user
            }))
            .catch(next)
    } else {
        res.status(GENERIC_ERROR).send({
            ok: false,
            message: 'Bad token'
        })
    }
}

module.exports = {
    getClients
}
