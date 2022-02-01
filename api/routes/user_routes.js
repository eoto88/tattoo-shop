'use strict'
const authJwt = require("../middleware/authJwt");

const router = require('express').Router()
const {
    postUsers,
    getUsers,
    getUser,
    putUser,
    deleteUser
} = require('../controllers/user_controller')

router.route('/users')
    .post(postUsers)
    .get(authJwt.verifyToken, getUsers)

router.route('/users/:id')
    .get(getUser)
    .put(putUser)
    .delete(deleteUser)

module.exports = router
