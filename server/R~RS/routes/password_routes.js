const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const accountSid = 'AC95cc07e98b7e37aecc045250a8e7b1a6';
const authToken = 'acf218a451b86d74cd80e51c2ad6c733';
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

// Password Verification for the user

router.post('/password/verifyUser', function(req, res) {
    userid = req.body.identifier;
    mobile = '';


    Users.basicDetls(userid, function(err, user) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            mobile = user.phone;
            session_id = uuidv4();
            shortener = genOTP();
            status = 'New Link';

            jwt.sign({ session_id }, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', { expiresIn: '24h' }, (err, token) => {
                const passData = {
                    userid: userid,
                    shortener: shortener,
                    sessionId: token,
                    status: status
                };
                Password_Change.createPasswordChangeToken(passData);
                createdLink = 'http://localhost:4200/passwordUpdate/' + userid + '/' + shortener;
                changedSendLink(createdLink, '+91', mobile, res);
            });
        }
    });
});

// Verify Password Change Request

router.post('/password/verify/shortener', function(req, res) {
    passwDetl = req.body;


    Password_Change.verifyPasswordChangeRequest(passwDetl.identifier, passwDetl.shortLink, function(err, pass) {
        if (err) {
            console.log('Error occured: --------> ' + err);
            const payload = {
                status: "403"
            }
            res.send(payload);
        } else {
            if (pass != null) {
                jwt.verify(pass.sessionId, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', (err1) => {
                    if (err1) {
                        const payload = {
                            status: "403"
                        }
                        res.send(payload);
                    } else {
                        const payload = {
                            status: "200"
                        }
                        res.send(payload);
                    }
                });
            } else {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            }

        }
    });
});

// Verify Password Change Request

router.post('/password/changePassword', function(req, res) {
    passwDetl = req.body;

    Password_Change.verifyPasswordChangeRequest(passwDetl.identifier, passwDetl.shortLink, function(err, pass) {
        if (err) {
            console.log('Error occured: --------> ' + err);
            const payload = {
                status: "403"
            }
            res.send(payload);

        } else {
            if (pass != null) {
                jwt.verify(pass.sessionId, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', (err1) => {
                    if (err1) {
                        const payload = {
                            status: "403"
                        }
                        res.send(payload);
                    } else {

                        Password_Change.updatePasswordStatus(passwDetl.identifier, passwDetl.shortLink, function(err2) {
                            if (err2) {
                                console.log('Error occured: --------> ' + err2);
                                const payload = {
                                    status: "403"
                                }
                                res.send(payload);
                            } else {
                                Users.updatePassword(passwDetl.identifier, passwDetl.password, function(err3) {
                                    if (err3) {
                                        console.log('Error occured: --------> ' + err3);
                                        const payload = {
                                            status: "403"
                                        }
                                        res.send(payload);
                                    } else {
                                        const payload = {
                                            status: "200"
                                        }
                                        res.send(payload);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            }

        }
    });


});

// Send Link To Change The Password

function changedSendLink(smsBody, countryCode, mobile, res) {
    receiver_N = countryCode + mobile;
    otp_message = smsBody;
    console.log("Sending OTP to " + receiver_N);
    console.log(otp_message);


    var client = new twilio(accountSid, authToken);
    client.messages.create({
            body: otp_message,
            to: receiver_N, // Text this number
            from: '(323) 772-5447' // From a valid Twilio number
        })
        .then((message) => {
            console.log("Message Sent --> " + message.sid);
            if (message.sid) {
                res.json({
                    status: "200"
                });
            } else {
                res.json({
                    status: "403"
                });
            }
        });
}

// Generate Random Session identifier

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Generate Random 6 digit OTP

function genOTP() {
    return 'xxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


module.exports = router;