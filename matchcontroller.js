const Match = require("./matchmodel");
const Player = require("./playermodel");
const server = require("./server");
const {ObjectId} = require('mongodb');

const router = server.router;

let teamOneMMR;
let teamTwoMMR;
let teamOneLoad = -1;
let teamTwoLoad = -1;
let responded = false;

module.exports = {
    findActiveMatch: function (req, res) {
        
        const {sessionId} = req.body;
        Match.findOne({isActive: true, sessionId: sessionId}, (err, data) => {
            if (err)
                return res.send(err);
            return res.json({success: true, data: data});
        });
    },
    getMatchesForId: function (req, res) {
        const {sessionId} = req.body;
        console.log(sessionId);
        Match.find({sessionId: sessionId}, (err, data) => {
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
    endMatch: function (req, res) {
        const {_id} = req.body;
        const {results} = req.body;
        const {winners} = req.body;

        Match.findOneAndUpdate({_id: _id}, {isActive: false, results: results, winners: winners}, {new : true}, (err, doc) => {
            if (err) {
                return res.send(err);
            }
            doc.toObject({getters: true});
            doc.processMatch();
            return res.json({success: true});
        });
    },
    getTMMR: function (req, res) {
        const {teamOne} = req.body;
        const {teamTwo} = req.body;

        teamOneMMR = 0;
        teamTwoMMR = 0;
        teamOneLoad = teamOne.length;
        teamTwoLoad = teamTwo.length;
        responded = false;


        for (var i = 0; i < teamOne.length; i++) {
            const id = teamOne[i].id;

            Player.findOne({_id: id}, (err, doc) => {
                if (err) {

                } else {
//                doc.toObject({getters: true});
                    teamOneMMR = teamOneMMR + doc.mmr;
                    teamOneLoad = teamOneLoad - 1;
                    
                    let response = processTMMR();
                    if(response !== null && !responded) {
                        responded = true;
                        return res.json(response);
                    }
                }
            });

        }

        for (var i = 0; i < teamTwo.length; i++) {
            const id = teamTwo[i].id;

            Player.findOne({_id: id}, (err, doc) => {
                if (err) {

                } else {
                    teamTwoMMR = teamTwoMMR + doc.mmr;
                    teamTwoLoad = teamTwoLoad - 1;
                    
                    let response = processTMMR();
                    if(response !== null && !responded) {
                        responded = true;
                        return res.json(response);
                    }
                }
            });

        }

    }

}
function processTMMR() {
    console.log("outer" + teamOneMMR + "#" + teamTwoMMR);
    if(teamOneLoad === 0 && teamTwoLoad === 0) {
        console.log("inner");
        return {success: true, teamOneMMR: teamOneMMR, teamTwoMMR: teamTwoMMR};
    } else {
        return null;
    }
}