const jwt = require('jsonwebtoken');

const config = require('./config');
const {auth: {secret}} = config;

const withAuth = function (req, res, next) {
    const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

const withAdmin = function (req, res, next) {
    const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.cookies.token;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                console.log(decoded.admin);
                if (decoded.admin) {
                    req.name = decoded.name;
                    req.admin = decoded.admin;
                    next();
                } else {
                    res.status(401).send('Unauthorized: Invalid token');
                }

            }
        });
    }
};


exports.withAuth = withAuth;
exports.withAdmin = withAdmin;