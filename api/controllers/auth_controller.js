'use strict'

const jwt = require("jsonwebtoken");
const { User, Client } = require('../models')
const {
  createError,
  BAD_REQUEST,
  UNAUTHORIZED, NOT_FOUND
} = require('../helpers/error_helper')

let loggedUser;
const postLogin = (req, res, next) => {
  const username = String(req.body.email)
  const password = String(req.body.password)

  if (!username || !password) next(createError({
    status: BAD_REQUEST,
    message: '`username` + `password` are required fields'
  }))

  User.verify(username, password)
    .then(function (user) {
      loggedUser = user;
      var token = jwt.sign({ id_user: user.id }, process.env.AUTH_SECRET, {
        expiresIn: 86400 // 24 hours
      });
      res.json({
        ok: true,
        message: 'Login successful',
        id_user: user.id,
        name: user.name,
        email: user.email,
        accessToken: token
      })
    })
    .catch(err => next(createError({
      status: UNAUTHORIZED,
      message: err
    })))
}

const getUser = (req, res, next) => {
  if (loggedUser) {
    res.status(200).json({
      user: {
        id: loggedUser.id,
        name: loggedUser.name,
        email: loggedUser.email,
      },
    });
  } else {
    next(createError({
      status: UNAUTHORIZED,
      message: 'No user logged'
    }));
  }
}

const putUser = (req, res, next) => {
  if (loggedUser) {
    const oldEmail = loggedUser.email;
    const password = String(req.body.password)

    User.verify(oldEmail, password)
      .then(function (user) {
        const name = String(req.body.name);
        const newEmail = String(req.body.email);
        const newPassword = String(req.body.newPassword);

        const newUser ={
          name,
          email: newEmail,
          password: newPassword
        }
        User.update(user.id, newUser).then(function (response) {
          loggedUser = newUser;
          res.json({
            ok: true,
            message: 'User modified',
            response,
            id_user: req.id_user
          })
        }).catch(next)
      })
      .catch(err => next(createError({
        status: UNAUTHORIZED,
        message: err
      })))
  } else {
    return next(createError({
      status: UNAUTHORIZED,
      message: 'No logged user'
    }))
  }
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
  getUser,
  putUser,
  postRegister
}
