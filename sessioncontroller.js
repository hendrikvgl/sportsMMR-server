const Session = require("./sessionmodel");
const server = require("./server");

const router = server.router;

module.exports = {
    findActiveSession: function (req, res) {
        Session.findOne({ isActive: true }, (err, data) => {
            if (err)
                return res.send(err);
            return res.json({success: true, data: data});
        });
    },
    postSession: function (req, res) {
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
        session.save(err => {
            if (err)
                return res.json({success: false, error: err});
            return res.json({success: true});
        });
    },
    endSession: function(req,res) {
        const {_id} = req.body;
        console.log(_id);
        Session.findOneAndUpdate({ _id: _id },{isActive: false} ,err => {
            if (err)
                return res.send(err);
            return res.json({success: true});
        });
    }
    
}
