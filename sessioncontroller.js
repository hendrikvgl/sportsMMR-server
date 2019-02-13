const Session = require("./sessionmodel");
const server = require("./server");
const config = require('./config');
const {auth: {secret}} = config;
const jwt = require('jsonwebtoken');
const router = server.router;

module.exports = {
    findActiveSession: function (req, res) {

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

                    const crewId = decoded.id;

                    Session.findOne({crewId: crewId, isActive: true}, (err, data) => {
                        if (err)
                            return res.send(err);
                        return res.json({success: true, data: data});
                    });

                }
            });
        }
    },
    findAllSessions: function (req, res) {

        console.log("Req arrived", Date.now() /1000 |0);
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
                    console.log("Data query started", Date.now() /1000 |0);

                    const crewId = decoded.id;

                    Session.find({crewId: crewId}, (err, data) => {
                        if (err)
                            return res.send(err);
                        return res.json({success: true, data: data});
                    });

                }
            });
        }
    },
    postSession: function (req, res) {

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

                    const crewId = decoded.id;

                    let session = new Session();
                    const {players} = req.body;
                    if (!players) {
                        return res.json({
                            success: false,
                            error: "INVALID INPUTS"
                        });
                    }
                    session.isActive = true;
                    session.players = players;
                    session.crewId = crewId;
                    session.save(err => {
                        if (err)
                            return res.json({success: false, error: err});
                        return res.json({success: true});
                    });
                }
            });
        }


    },
    endSession: function (req, res) {

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

                    const crewId = decoded.id;

                    const {_id} = req.body;
                    console.log(_id);
                    Session.findOneAndUpdate({_id: _id, crewId: crewId}, {isActive: false}, err => {
                        if (err)
                            return res.send(err);
                        return res.json({success: true});
                    });
                }
            });
        }
    }

}
