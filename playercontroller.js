const Player = require("./playermodel");
const server = require("./server");
const {ObjectId} = require('mongodb');
const config = require('./config');
const {auth: {secret}} = config;
const jwt = require('jsonwebtoken');

const router = server.router;

let playerLoad = -1;
let playerMMR = [];

module.exports = {
    getPlayers: function (req, res) {

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

                    Player.find({crewId: crewId}, (err, data) => {
                        if (err)
                            return res.json({success: false, error: err});
                        return res.json({success: true, data: data});
                    });
                }
            });
        }


    },
    getPlayer: function (req, res) {
        //do something
    },
    postPlayer: function (req, res) {

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

                    let player = new Player();
                    const {name} = req.body;
                    if (!name) {
                        return res.json({
                            success: false,
                            error: "INVALID INPUTS"
                        });
                    }
                    player.crewId = decoded.id;
                    player.name = name;
                    player.mmr = 1000;
                    player.save(err => {
                        if (err)
                            return res.json({success: false, error: err});
                        return res.json({success: true});
                    });

                }
            });
        }


    },
    deletePlayer: function (req, res) {
        const {_id} = req.body;
        console.log(_id);
        Player.findOneAndDelete({_id: _id}, err => {
            if (err)
                return res.send(err);
            return res.json({success: true});
        });
    },
    getPlayersMMR: function (req, res) {

        const players = req.body.players;
        playerLoad = players.length;
        playerMMR = [];

        for (var i = 0; i < players.length; i++) {
            const id = players[i].id;

            Player.findOne({_id: id}, (err, doc) => {
                if (err) {

                }

                playerLoad = playerLoad - 1;
                let response = processPlayersMMR({id: doc.id, label: doc.name, mmr: doc.mmr});

                if (response !== null) {
                    return res.json(response);
                }
            });

        }
    }
}

function processPlayersMMR(obj) {
    playerMMR.push(obj);
    if (playerLoad === 0) {
        return ({success: true, data: playerMMR});
    } else {
        return null;
    }

}
