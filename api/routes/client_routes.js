'use strict'
const authJwt = require("../middleware/authJwt");

const router = require('express').Router()
const {
    getClients,
    // getClient,
    // putClient,
    // deleteClient
} = require('../controllers/client_controller')

router.route('/clients')
    .get(authJwt.verifyToken, getClients)

// router.route('/client/:id')
//     .get(getClient)
//     .put(putClient)
//     .delete(deleteClient)

module.exports = router
