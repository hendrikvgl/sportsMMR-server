const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Player = require("./playermodel");
//const Player = mongoose.model('Player').schema;

var teamOneLoad = -1;
var teamTwoLoad = -1;
var executed = false;
var teamTwoMMR = 0;
var teamTwoObj = [];
var teamOneMMR = 0;
var teamOneObj = [];
var results = [];
var matchId = null;

// this will be our data base's data structure 
let DataSchema = new Schema(
        {
            isActive: Boolean,
            teamOne: [],
            teamTwo: [],
            sessionId: String,
            winners: [],
            results: []
        },
        {timestamps: true}
);

DataSchema.method('processMatch', function () {

    teamOneLoad = -1;
    teamTwoLoad = -1;
    executed = false;
    teamTwoMMR = 0;
    teamTwoObj = [];
    teamOneMMR = 0;
    teamOneObj = [];

    console.log("teamOne: " + JSON.stringify(this.teamOne));
    console.log("teamTwo: " + JSON.stringify(this.teamTwo));
    console.log("results: " + this.results);

    matchId = this._id;
    var teamOne = this.teamOne;
    var teamTwo = this.teamTwo;
    results = this.results;

    teamOneLoad = teamOne.length;
    teamTwoLoad = teamTwo.length;


    var i;
    for (i = 0; i < teamOne.length; i++) {
        mongoose.model('Player').findOne({_id: teamOne[i].id}, (err, player) => {
            if (err) {

            }
//            let player = doc[0].toObject({getters: true});
            teamOneObj.push(player);
            teamOneMMR = teamOneMMR + player.mmr;
           

            teamOneLoad = teamOneLoad - 1;
            processMMR();

        });
    }



    for (var i = 0; i < teamTwo.length; i++) {
        mongoose.model('Player').findOne({_id: teamTwo[i].id}, (err, player) => {
            if (err) {

            }
//            const player = data[0].toObject({getters: true});

            teamTwoObj.push(player);
            teamTwoMMR = teamTwoMMR + player.mmr;

            teamTwoLoad = teamTwoLoad - 1;
            processMMR();

        });
    }

});

function processMMR() {
    console.log("Processing MMR");
    if (teamOneLoad === 0 && teamTwoLoad === 0 && executed === false) {
        executed = true;

        
        

        const sumMMR = teamOneMMR + teamTwoMMR;
        const teamOneStakePerc = teamOneMMR / sumMMR;
        const teamTwoStakePerc = teamTwoMMR / sumMMR;

        const playerCount = teamOneObj.length + teamTwoObj.length;
        const totalCost = playerCount * 10;

        const teamOneCost = teamOneStakePerc * totalCost;
        const teamTwoCost = teamTwoStakePerc * totalCost;

        const teamOnePlayerCost = teamOneCost / teamOneObj.length;
        const teamTwoPlayerCost = teamTwoCost / teamTwoObj.length;

        let teamOneEarnings = 0;
        let teamTwoEarnings = 0;

        if (results[0] > results[1]) {
            teamOneEarnings = teamOneEarnings + totalCost / 2;
        } else if (results[0] < results[1]) {
            teamTwoEarnings = teamTwoEarnings + totalCost / 2;
        }

        const teamOnePointPerc = results[0] / (results[0] + results[1]);
        const teamTwoPointPerc = results[1] / (results[0] + results[1]);

        teamOneEarnings = teamOneEarnings + (totalCost / 2 * teamOnePointPerc);
        teamTwoEarnings = teamTwoEarnings + (totalCost / 2 * teamTwoPointPerc);

        const teamOnePlayerEarnings = teamOneEarnings / teamOneObj.length;
        const teamTwoPlayerEarnings = teamTwoEarnings / teamTwoObj.length;

        const teamOnePlayerDelta = teamOnePlayerEarnings - teamOnePlayerCost;
        const teamTwoPlayerDelta = teamTwoPlayerEarnings - teamTwoPlayerCost;
        
        console.log("teamOne: " + teamOnePlayerDelta);
        console.log("teamTwo: " + teamTwoPlayerDelta);
        
        for (var i = 0; i<teamOneObj.length; i++) {
            console.log(JSON.stringify(teamOneObj[i]));
            teamOneObj[i].changeMmr({matchId: matchId,change: teamOnePlayerDelta}, function() {
                console.log("Team1Player Updated");
            });
        }
        
        
        for (var i = 0; i<teamTwoObj.length; i++) {
            console.log(JSON.stringify(teamTwoObj[i]));
            teamTwoObj[i].changeMmr({matchId: matchId,change: teamTwoPlayerDelta}, function() {
                console.log("Team2Player Updated");
            });
        }
    }
}

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Match", DataSchema);