const express = require('express');
const router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

// ******** Schema Models ******** //
const Trains = require('../models/train-schema');

// ******** Execution Begins here ******** //

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});

// ******** REST APIS Trains ******** //

//This API Will Return Entire Train In Database in JSON format

router.get('/api/trains', function(req, res, next) {
    Trains.getTrains(function(err, train) {
        if (err)
            console.log('Error occured: --------> ' + err);
        res.json(train)
            // console.log(train);
    });
});

//This API Will Return limit to 20 Train In Database in JSON format

router.get('/api/trains1', (req, res, limit) => {
    Trains.find({}).limit(20).then((trains) => {
        res.status(200).send(trains);

    });

});

// Post Trains

router.post('/api/trains', (req, res) => {
    var trn = new Trains({

        trainNo: req.body.trainNo,
        trainName: req.body.trainName,

        runsFromStn: req.body.runsFromStn,
        src: req.body.src,
        srcCode: req.body.srcCode,
        dstn: req.body.dstn,
        dstnCode: req.body.dstnCode,
        fromStn: req.body.fromStn,
        fromStnCode: req.body.fromStnCode,
        toStn: req.body.toStn,
        toStnCode: req.body.toStn,
        depAtFromStn: req.body.depAtFromStn,
        arrAtToStn: req.body.arrAtToStn,
        travelTime: req.body.travelTime,
        trainType: req.body.trainType,
        AC1Tier: req.body.AC1Tier,
        AC2Tier: req.body.AC2Tier,
        sleeperClass: req.body.sleeperClass,
    });
    trn.save((err, doc) => {
        try {
            res.status(200).send(doc);
        } catch (err) {
            res.status(404).send()
            console.log(err);
        }
    })
});

// Post Trains

router.post('/api/trains1', (req, res) => {
    var trn = new Trains({

        trainNo: req.body.trainNo,
        trainName: req.body.trainName,

        runsFromStn: req.body.runsFromStn,
        src: req.body.src,
        srcCode: req.body.srcCode,
        dstn: req.body.dstn,
        dstnCode: req.body.dstnCode,
        fromStn: req.body.fromStn,
        fromStnCode: req.body.fromStnCode,
        toStn: req.body.toStn,
        toStnCode: req.body.toStn,
        depAtFromStn: req.body.depAtFromStn,
        arrAtToStn: req.body.arrAtToStn,
        travelTime: req.body.travelTime,
        trainType: req.body.trainType,
        AC1Tier: req.body.AC1Tier,
        AC2Tier: req.body.AC2Tier,
        sleeperClass: req.body.sleeperClass,
    });
    trn.save((err, doc) => {
        try {
            res.status(200).send(doc);
        } catch (err) {
            res.status(404).send()
            console.log(err);
        }
    })
});

// Get Trains By id

router.get('/api/trains1/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('No Record with given id: ${req.params.id}');
    } else {
        Trains.findById(req.params.id, (err, doc) => {
            if (!err) {
                res.status(200).send(doc);
            } else {
                console.log(err);
            }

        });
    }
});

// Update Trains By Id

router.put('/api/trains1/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('No Record with given id: ${req.params.id}')
    } else {
        var trn = {

            trainNo: req.body.trainNo,
            trainName: req.body.trainName,

            runsFromStn: req.body.runsFromStn,
            src: req.body.src,
            srcCode: req.body.srcCode,
            dstn: req.body.dstn,
            dstnCode: req.body.dstnCode,
            fromStn: req.body.fromStn,
            fromStnCode: req.body.fromStnCode,
            toStn: req.body.toStn,
            toStnCode: req.body.toStn,
            depAtFromStn: req.body.depAtFromStn,
            arrAtToStn: req.body.arrAtToStn,
            travelTime: req.body.travelTime,
            trainType: req.body.trainType,
            AC1Tier: req.body.AC1Tier,
            AC2Tier: req.body.AC2Tier,
            sleeperClass: req.body.sleeperClass,
        };
        Trains.findByIdAndUpdate(req.params.id, { $set: trn }, { new: true }, (err, doc) => {
            try {
                res.send(doc);
            } catch {
                console.log(err);
            }
        });
    }
});

// Delete Trains By Id

router.delete('/api/trains1/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('No Record with given id: ${req.params.id}')
    } else {
        Trains.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) {
                res.send(doc);
            } else {
                console.log(err);
            }
        });
    }
});


module.exports = router;