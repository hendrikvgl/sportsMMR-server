const Player = require("./playermodel");
const server = require("./server");

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
         console.log("boingflip");
        let player = new Player();

        const {id, name} = req.body;

        if ((!id && id !== 0) || !name) {
            return res.json({
                success: false,
                error: "INVALID INPUTS"
            });
        }
        player.name = name;
        player.id = id;
        player.save(err => {
            if (err)
                return res.json({success: false, error: err});
            return res.json({success: true});
        });
    }
}
