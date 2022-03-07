'use strict'

const router = require('express').Router()
const authJwt = require("../middleware/authJwt");
const {
  postLogin,
  getUser,
  putUser,
  postRegister
} = require('../controllers/auth_controller')

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.route('/login')
  .post(postLogin)

router.route('/me')
  .get(authJwt.verifyToken, getUser)
  .put(authJwt.verifyToken, putUser)

router.route('/register')
  .post(postRegister)

module.exports = router
