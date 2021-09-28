const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const twilio = require('twilio');

// Twillio Sid and AuthToken for messaging services

const accountSid = 'AC95cc07e98b7e37aecc045250a8e7b1a6';
const authToken = 'acf218a451b86d74cd80e51c2ad6c733';

// Schema models

Users = require('../models/users-schema');

// ******** Execution Begins here ******** //

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});


// Rest APIs for Authentication and Authorizatuion


router.post('/login', function(req, res) {
    var cred = req.body;

    Users.createToken(cred.identifier, function(err, user) {
        if (err)
            console.log('Error occured:' + err);
        else {

            if (user == null) {
                res.json({
                    status: "403"
                });
            } else {
                if (cred.identifier == user.email && cred.password == user.password) {

                    if (user.sessionStatus === "Not Verified") {
                        res.json({
                            userid: cred.identifier,
                            status: 401
                        });
                    } else {

                        var data = {
                            "email": user.email,
                            "session_id": uuidv4(),
                            "creation_time": Date.now(),
                        };

                        if (user.userType == "admin")
                            routes = "/admin";
                        else
                            routes = "/user";


                        jwt.sign({ data }, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', { expiresIn: '24h' }, (err, token) => {
                            var messagePayload = {
                                "token": token,
                                "route": routes,
                                "status": "200"
                            };
                            updateTokenLogin(user.email, token, res, messagePayload);
                        });
                    }

                } else {
                    res.json({
                        status: "403"
                    });
                }
            }

        }

    });

});



router.post('/login/signOn', verifyToken, function(req, res) {
    token = req.token;
    jwt.verify(req.token, '4E37F6EB24C177F499C491BB9748EEE2118D8F2F984E37F6AAC40F356ECCEW8I', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            tokenVerification(authData.data.email, token, res);
        }
    });
});



router.post('/signUpUser', function(req, res) {
    userData = req.body;
    Users.createUser(userData, function(err, user) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            res.send(user);
        }
    });
});
router.post('/verifyUserChallenge', function(req, res) {
    userId = req.body;
    Users.checkUserStatus(userId.identifier, function(err, user) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            if (user.sessionStatus === 'Not Verified') {

                const otpDetails = {
                    "email": user.email,
                    "session_id": uuidv4(),
                    "otpn": genOTP(),
                    "type": "User-Auth",
                    "status": "Not Verified"
                };

                RqOTP.requestOTPGeneration(otpDetails);
                sendOTP(otpDetails.session_id, user.countryCode, user.phone, otpDetails.otpn, res);

                // call otp builder requestOTPGeneration
            } else {
                res.sendStatus(403);
            }
        }
    });
});


router.post('/api/myprofile/details', function(req, res) {
    Users.profileDetails(req.body.identifier, function(err, user) {
        if (err) {
            console.log('Error occured: --------> ' + err);
            const payload = {
                status: "403"
            }
            res.send(payload);
        } else {
            if (user == null) {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            } else {
                const userData = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dob: user.dob,
                    address: user.address,
                    city: user.city,
                    state: user.state,
                    country: user.country,
                    pin: user.pin,
                    countryCode: user.countryCode,
                    phone: user.phone,
                    email: user.email,
                    aadhar: user.aadhar,
                    pan: user.pan,
                    occupation: user.occupation,
                    status: "200"
                };
                res.send(userData);
            }
        }
    });

});



router.post('/api/sigin/details', function(req, res) {
    Users.basicDetls(req.body.identifier, function(err, user) {
        if (err) {
            console.log('Error occured: --------> ' + err);
            const payload = {
                status: "403"
            }
            res.send(payload);
        } else {
            if (user == null) {
                const payload = {
                    status: "403"
                }
                res.send(payload);
            } else {
                const userData = {
                    firstName: user.firstName,
                    email: user.email,
                    status: "200"
                };
                res.send(userData);
            }
        }
    });

});

router.get('/api/user/details', (req, res, limit) => {
        Users.find({}).then((users) => {
            res.send(users)

        })
    })
    // Callback Functions for Token Verification and Updation

function updateTokenLogin(email, token, res, carrier) {
    Users.updateToken(email, "Signed In", token, function(err) {
        if (err)
            console.log('Error occured: --------> ' + err);
        else {
            res.json(carrier);
        }

    });
}

function tokenVerification(email, token, res) {

    Users.verifyToken(email, function(err, user) {
        if (err)
            console.log('Error occured: --------> ' + err);
        else {
            if (token == user.currentSession && user.sessionStatus == "Signed In") {
                if (user.userType == "admin")
                    routes = "/admin";
                else
                    routes = "/user";

                res.json({
                    route: routes,
                    status: "200"
                });

            } else {
                res.json({
                    status: "403"
                });
            }


        }
    });

}


// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const reqHeader = req.headers['authorization'];
    // Check if reqHeader is undefined
    if (typeof reqHeader !== 'undefined') {
        // Get token from reqHeader
        req.token = reqHeader;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}

// OTP Creation and Confirmation

function sendOTP(session_id, countryCode, rec_number, otp_m, res) {
    receiver_N = countryCode + rec_number;
    hashed_N = countryCode + ' ***** *' + rec_number.substring(6, rec_number.length);
    otp_message = 'Your user verification OTP for RRS is ' + otp_m;
    console.log(otp_message);
    console.log("Sending OTP to " + receiver_N);




    var client = new twilio(accountSid, authToken);
    client.messages.create({
            body: otp_message,
            to: receiver_N, // Text this number
            from: '(323) 772-5447' // From a valid Twilio number
        })
        .then((message) => {
            console.log("Message Sent --> " + message.sid);
        });


    res.json({
        session_id: session_id,
        phone: hashed_N,
        status: "200"
    });

}

// Random Values generated for token creation

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Random Values generated for OTP 

function genOTP() {
    return 'xxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = router;