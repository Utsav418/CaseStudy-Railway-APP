const express = require('express');
const router = express.Router();
cors = require('cors');

// ******** Schema Models ******** //

Users = require('../models/users-schema');

// ******** Execution Begins here ******** //

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});

//Verify OTP Sent On Phone

router.post('/verifyOTP', function(req, res) {
    otpResponse = req.body;
    RqOTP.verifyResponse(otpResponse.identifier, otpResponse.session_id, otpResponse.otpn, function(err, otpVer) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            updateOTPStatus(otpResponse.identifier, otpVer[0]._id, otpVer[0].session_id, res);
        }
    });
});

// OTP Status Updation

function updateOTPStatus(user, otpid, s_id, res) {
    RqOTP.updateStatus(otpid, function(err) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            Users.updateUserStatus(user, function(err) {
                if (err) {
                    console.log('Error occured: --------> ' + err);
                } else {
                    const payload = {
                        'session_id': s_id,
                        'status': '200'
                    };
                    res.send(payload);
                }
            });
        }
    });
}

module.exports = router;