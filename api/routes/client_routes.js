'use strict'
const authJwt = require("../middleware/authJwt");

const router = require('express').Router()
const {
    getClients,
    getClient,
    postClient
    // putClient,
    // deleteClient
} = require('../controllers/client_controller')

router.route('/clients')
    .get(authJwt.verifyToken, getClients)
    .post(authJwt.verifyToken, postClient)

router.route('/client/:id')
    .get(authJwt.verifyToken, getClient)
//     .put(putClient)
//     .delete(deleteClient)

module.exports = router
