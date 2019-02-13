const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
        {
            name: String,
            mmr: Number,
            mmrSequence: [],
            mmrSequenceMatch: [],
            crewId: String
        },
        {timestamps: true}
);

DataSchema.methods.changeMmr = function (params, callback) {
    const matchId = params.matchId;
    
    
    console.log(this.label + "change: " + params.change);
    
    this.mmrSequenceMatch.push(matchId);
    const change = params.change;
    this.mmrSequence.push(change);
    this.mmr = this.mmr + change;

    this.save(err => {
        if (err) {
            
        }
            
        callback();
    });
};

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Player", DataSchema);