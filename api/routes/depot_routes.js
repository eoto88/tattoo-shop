'use strict'
const authJwt = require("../middleware/authJwt");

const router = require('express').Router()
const {
    getClientDepots,
    postClientDepot,
    putClientDepot,
    deleteClientDepot,
} = require('../controllers/depot_controller')

router.route('/client/:id_client/depots')
    .get(authJwt.verifyToken, getClientDepots)
    .post(authJwt.verifyToken, postClientDepot)

router.route('/client/:id_client/depot/:id')
    .put(authJwt.verifyToken, putClientDepot)
    .delete(authJwt.verifyToken, deleteClientDepot)

module.exports = router
