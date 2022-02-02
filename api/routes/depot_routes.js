'use strict'
const authJwt = require("../middleware/authJwt");

const router = require('express').Router()
const {
    getClientDepots,
    postClientDepot,
    putClientDepot,
    // deleteDepot,
} = require('../controllers/depot_controller')

router.route('/client/:id_client/depots')
    .get(authJwt.verifyToken, getClientDepots)
    .post(authJwt.verifyToken, postClientDepot)
    .put(authJwt.verifyToken, putClientDepot)
    // .delete(authJwt.verifyToken, deleteDepot)

module.exports = router
