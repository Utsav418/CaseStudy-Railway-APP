var express = require('express');
var mongoose = require('mongoose')
var bodyParser = require('body-parser');
const cors = require('cors')


// ******** To allow CORS ******** //

'Access-Control-Allow-Origin', '*'
'Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT'

// ******** Application Setup ******** //

const app = express()
app.use(cors());
app.use(express.json());

/**
 * The following function will import all generated file in this directory.
 * So you just need to require this file inside <root_dir>/swagger.js,
 * to get all the necessary objects created in this folder :)
 */

// ******** Schema Models ******** //

Trains = require('./models/train-schema');
Stations = require('./models/station-schema');
Users = require('./models/users-schema');
RqOTP = require('./models/reqotp-schema');
Booking = require('./models/booking-schema');
Password_Change = require('./models/password_detl-schema');
Notify = require('./models/notif-schema');

// ******** Routes ********

const userAuth = require('./controllers/auth_routes');
const trainRoutes = require('./routes/train_routes');
const stationRoutes = require('./routes/station_routes');
const bookingRoutes = require('./routes/booking_routes');
const otpRoutes = require('./routes/otp_routes');
const passwordRoutes = require('./routes/password_routes');

// ******** Execution Begins Here ******** //

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});

// ********  DAtabase Connectivity Witgh MongoDb Atlas ******** //

mongoose.connect('mongodb://CS_Admin:admin123@casestudy-shard-00-00.isphm.mongodb.net:27017,casestudy-shard-00-01.isphm.mongodb.net:27017,casestudy-shard-00-02.isphm.mongodb.net:27017/Main-Microservice?ssl=true&replicaSet=atlas-90nbdi-shard-0&authSource=admin&retryWrites=true&w=majority').then(
    () => { console.log("DB connected.") },
    err => { console.log(err) }
);

// ******** Database Connectivity With MongoDb (Mongod) ******** //

mongoose.connect('mongodb://localhost/CaseStudy_DB').then(
    () => { console.log("DB connected.") },
    err => { console.log(err) }
);
var db = mongoose.connection;

// ******** REST APIS ******** //

app.get('/', function(req, res, next) {
    res.sendStatus(404)
});

//  ******** API Routings ******** //

app.use(userAuth);
app.use(trainRoutes);
app.use(stationRoutes);
app.use(bookingRoutes);
app.use(otpRoutes);
app.use(passwordRoutes);

// ****** APP SERVER RUNNING LOG ****** //

app.listen(3000, () => console.log('Server Running on port 3000.'))

module.exports = app;