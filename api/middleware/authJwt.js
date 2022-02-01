'use strict'
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.id_user = decoded.id_user;
        next();
    });
};

module.exports = {
    verifyToken
};
