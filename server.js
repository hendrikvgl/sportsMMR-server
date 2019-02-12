const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const logger = require("morgan");
var cors = require('cors');

const API_PORT = 3001;
const app = express();
const router = express.Router();


// this is our MongoDB database
const dbRoute = "mongodb://localhost:27017/sportsmmr?authSource=admin --username sportsMMR";

exports.router = router;

// connects our back end code with the database
mongoose.connect(
        dbRoute,
        {useNewUrlParser: true}
);

let db = mongoose.connection;
exports.db = db;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('trust proxy', 1);

app.use(cookieParser());

app.use(logger("dev"));

var whitelist = ['http://127.0.0.1:3000', 'http://charlesmedia.stream:480/'];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

var routes = require('./routes');
// append /api for our http requests
app.use("/api", routes);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));