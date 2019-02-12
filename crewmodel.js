const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const saltRounds = 10;

// this will be our data base's data structure 
const DataSchema = new Schema(
        {
            name: {type: String, required: true, unique: true},
            email: {type: String, required: true, unique: true},
            password: {type: String, required: true},
            adminPassword: {type: String, required: true}
        },
        {timestamps: true}
);

DataSchema.methods.isCorrectPassword = function (admin, password, callback) {
    let pass = this.password;
    if (admin) {
        pass = this.adminPassword;
    } 
    
    bcrypt.compare(password, pass, function (err, same) {
        if (err) {
            callback(err);
        } else {
            callback(err, same);
        }
    });
}

DataSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('adminPassword')) {

        const document = this;
        bcrypt.hash(document.adminPassword, saltRounds,
                function (err, hashedPassword) {
                    if (err) {
                        next(err);
                    } else {
                        document.adminPassword = hashedPassword;
                        next();
                    }
                });
    } else {
        next();
    }
});

DataSchema.pre('save', function (next) {
    // Check if document is new or a new password has been set
    if (this.isNew || this.isModified('password')) {
        // Saving reference to this because of changing scopes
        const document = this;
        bcrypt.hash(document.password, saltRounds,
                function (err, hashedPassword) {
                    if (err) {
                        next(err);
                    } else {
                        document.password = hashedPassword;
                        next();
                    }
                });

    } else {
        next();
    }
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Crew", DataSchema);