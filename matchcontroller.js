const Match = require("./matchmodel");
const server = require("./server");
const {ObjectId} = require('mongodb');

const router = server.router;

module.exports = {
    findActiveMatch: function (req, res) {
        Match.findOne({ isActive: true }, (err, data) => {
            if (err)
                return res.send(err);
            return res.json({success: true, data: data});
        });
    },
    getMatchesForId: function (req, res) {
        const {sessionId} = req.body;
        Match.find({ sessionId: sessionId},(err, data) => {
            if (err)
                return res.json({success: false, error: err});
            return res.json({success: true, data: data});
        });
    },
    postMatch: function (req, res) {
        let match = new Match();
        const {teamOne} = req.body;
        const {teamTwo} = req.body;
        const {sessionId} = req.body;
        if (!teamOne || !teamTwo || !sessionId) {
            return res.json({
                success: false,
                error: "INVALID INPUTS"
            });
        }
        match.isActive = true;
        match.teamOne = teamOne;
        match.teamTwo = teamTwo;
        match.sessionId = sessionId;
        
        match.save(err => {
            if (err)
                return res.json({success: false, error: err});
            return res.json({success: true});
        });
    },
    endMatch: function(req,res) {
        const {_id} = req.body;
        const {results} = req.body;
        const {winners} = req.body;

        Match.findOneAndUpdate({ _id: _id },{isActive: false, results: results, winners: winners} ,err => {
            if (err)
                return res.send(err);
            return res.json({success: true});
        });
    }
}
