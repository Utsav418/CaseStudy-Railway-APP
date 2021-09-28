const express = require('express');
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

// ******** Schema Models ******** //

const Stations = require('../models/station-schema');

// ******** Execution Begins here ******** //

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});

//This API Will Return Entire Station In Database in JSON format

router.get('/api/stations', function(req, res, next) {
    Stations.getStations(function(err, station) {
        if (err)
            console.log('Error occured:' + err);
        res.json(station)
            // console.log(station);
    });
});

//This API Will Return limit to 20 Stations In Database in JSON format

router.get('/api/stations1', (req, res) => {
    Stations.find({}).then((stations) => {
        res.status(200).send(stations).limit(20);
    });
});

// Post Stations

router.post('/api/stations1', (req, res) => {
    var stn = new Stations({
        stn: req.body.stn,
        stnCode: req.body.stnCode,

    });
    stn.save((err, doc) => {
        if (!err) {
            res.status(200).send(doc);
        } else {
            res.status(404).send
            console.log(err);
        }
    })
})

// Post two Station and get the train Exist between these two stations

router.post('/api/stations/betw', function(req, res) {
    stationDetl = req.body;
    console.log(stationDetl);
    Trains.getTrains(stationDetl.station1, stationDetl.station2, function(err, station) {
        if (err)
            console.log('Error occured: --------> ' + err);
        else {
            // console.log(station)
            res.json(station);

        }
    });
});

// Get Station Info By id

router.get('/api/stations1/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send('No Record with given id: ${req.params.id}');
    } else {
        Stations.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.status(200).send(doc);
            } else {
                console.log(err);
            }

        });
    }
})

// Update Station Info By id

router.put('/api/stations1/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).send('No Record with given id: ${req.params.id}')
    } else {
        var stn = {
            stn: req.body.stn,
            stnCode: req.body.stnCode,

        };
        Stations.findByIdAndUpdate(req.params.id, { $set: stn }, { new: true }, (err, doc) => {
            if (!err) {
                res.send(doc);
            } else {
                console.log(err);
            }
        });
    }
});

// Delete Station By Id

router.delete('/api/stations1/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('No Record with given id: ${req.params.id}')
    } else {
        Stations.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) {
                res.send(doc);
            } else {
                console.log(err);
            }
        });
    }
});

module.exports = router;