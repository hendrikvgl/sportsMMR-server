const Crew = require("./crewmodel");
const server = require("./server");
const config = require('./config');
const {auth: {secret}} = config;

const router = server.router;
const jwt = require('jsonwebtoken');


module.exports = {
    getCrews: function (req, res) {
        Crew.find((err, data) => {
            if (err)
                return res.json({success: false, error: err});
            return res.json({success: true, data: data});
        });
    },
    authenticate: function (req, res) {
        const {name, admin, password} = req.body;
        Crew.findOne({name}, function (err, crew) {
            if (err) {
                console.error(err);
                res.status(500)
                        .json({
                            error: 'Internal error please try again'
                        });
            } else if (!crew) {
                res.status(401)
                        .json({
                            error: 'Incorrect email or password'
                        });
            } else {
                crew.isCorrectPassword(admin, password, function (err, same) {
                    if (err) {
                        res.status(500)
                                .json({
                                    error: 'Internal error please try again'
                                });
                    } else if (!same) {
                        res.status(401)
                                .json({
                                    error: 'Incorrect name or password'
                                });
                    } else {
                        // Issue token
                        const id = crew._id;
                        const payload = {name, admin, id};
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '1000h'
                        });
                        res.cookie('token', token, {secure: false, maxAge: 10000000000, httpOnly: true})
                                .sendStatus(200);
                    }
                });
            }
        });
    },
    logout: function (req, res) {

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
                    res.cookie('token', "", {secure: false, httpOnly: true})
                            .sendStatus(200);

                }
            });
        }

    },
    postCrew: function (req, res) {

        const {name, email, password, adminPassword} = req.body;
        const crew = new Crew({name, email, password, adminPassword});
        crew.save(function (err) {
            if (err) {
                res.status(500)
                        .send("Error registering new user please try again.");
            } else {
                res.status(200).send("Welcome to the club!");
            }
        });
    },
    getCrewId: function (req, res) {
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
                    res.status(200).send({id: decoded.id, admin: decoded.admin});

                }
            });
        }
    }
}

