'use strict'
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let authHeader = req.headers["x-access-token"];
    if( ! authHeader ) {
        authHeader = req.get("Authorization");
    }

    if (!authHeader) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    const token = authHeader.split(" ")[1];
    try {
        jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!"
                });
            }
            req.id_user = decoded.id_user;
            // setTimeout(function() {
            //     next();
            // }, 2000);
            next();
        });
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
};

module.exports = {
    verifyToken
};
