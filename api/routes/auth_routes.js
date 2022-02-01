'use strict'

const router = require('express').Router()
const {
    postLogin,
    postRegister
} = require('../controllers/auth_controller')

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.route('/login')
    .post(postLogin)

router.route('/register')
    .post(postRegister)

module.exports = router
