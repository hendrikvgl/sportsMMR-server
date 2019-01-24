const Player = require("./playermodel");
const server = require("./server");
const {ObjectId} = require('mongodb');

const router = server.router;

module.exports = {
    getPlayers: function (req, res) {
        Player.find((err, data) => {
            if (err)
                return res.json({success: false, error: err});
            return res.json({success: true, data: data});
        });
    },
    getPlayer: function (req, res) {
        //do something
    },
    postPlayer: function (req, res) {
        let player = new Player();
        const {name} = req.body;
        if (!name) {
            return res.json({
                success: false,
                error: "INVALID INPUTS"
            });
        }
        player.name = name;
        player.save(err => {
            if (err)
                return res.json({success: false, error: err});
            return res.json({success: true});
        });
    },
    deletePlayer: function (req, res) {
        const {id} = req.body;
        
        Player.findOneAndDelete({ _id: id }, err => {
            if (err)
                return res.send(err);
            return res.json({success: true});
        });
    }
}
