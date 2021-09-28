const express = require('express');
const router = express.Router();

// ******** Schema Models ******** //

Users = require('../../models/users-schema');

// ******** Execution Begins here ******** //

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});

// Create Notifications

router.post('/api/notification/create', function(req) {
    const message_notify = {
        userid: req.body.userid,
        dateOfCreation: req.body.dateOfCreation,
        title: req.body.title,
        description: req.body.description,
        status: 'UNREAD'
    }
    Notify.createNotification(message_notify);
});

// View Notification and Change Status if Seen Or Not

router.post('/api/notification/view', function(req, res) {
    Notify.notificationUnRead(req.body.identifier, function(err, notify) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            res.send(notify);
        }
    });
});

// Read Notifications

router.post('/api/notification/read', function(req, res) {
    Notify.notificationRead(req.body.idrq, req.body.identifier, function(err) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            res.sendStatus(200);
        }
    });
});

// Find all the Notifications

router.get('/api/user/notifications', (req, res) => {
    Notifications.find({}).then((notify) => {
        res.send(notify)

    })
})

module.exports = router;