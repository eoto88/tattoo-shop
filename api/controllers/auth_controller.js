'use strict'

const jwt = require("jsonwebtoken");
const { User } = require('../models')
const {
    createError,
    BAD_REQUEST,
    UNAUTHORIZED
} = require('../helpers/error_helper')

const postLogin = (req, res, next) => {
    const username = String(req.body.email)
    const password = String(req.body.password)

    if (!username || !password) next(createError({
        status: BAD_REQUEST,
        message: '`username` + `password` are required fields'
    }))

    User.verify(username, password)
        .then(function(user) {
            var token = jwt.sign({ id_user: user.id }, process.env.AUTH_SECRET, {
                expiresIn: 86400 // 24 hours
            });
            res.json({
                ok: true,
                message: 'Login successful',
                userId: user.id_user,
                email: user.email,
                accessToken: token
            })
        })
        .catch(err => next(createError({
            status: UNAUTHORIZED,
            message: err
        })))
}

const postRegister = (req, res, next) => {
    const props = req.body.user

    User.findOne({ email: props.email })
        .then(user => {
            if (user) return next(createError({
                status: CONFLICT,
                message: 'Username already exists with this email'
            }))

            return User.create(props)
        })
        .then(user => res.json({
            ok: true,
            message: 'Registration successful',
            user
        }))
        .catch(next)
}

module.exports = {
    postLogin,
    postRegister
}
