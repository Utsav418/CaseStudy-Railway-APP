const express = require('express');
var twilio = require('twilio');
const router = express.Router();
// ******** Schema Models ******** //

const Bookings = require('../models/booking-schema');
const Trains = require('../models/train-schema');
Users = require('../models/users-schema');

// ObjectId

var ObjectId = require('mongoose').Types.ObjectId;

// Twillio Sid and AuthToken for messaging services

const accountSid = 'AC95cc07e98b7e37aecc045250a8e7b1a6';
const authToken = 'acf218a451b86d74cd80e51c2ad6c733';

// RAzorPay


// ******** Execution Begins here ******** //

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    console.log('ip:', req.ip);
    next();
});

// Provisional ID

router.post('/api/booking/provisional', function(req, res) {
    bookingData = req.body;
    provId = genProvId();

    adultNo = 0;
    children = 0;
    tatkalChrge = 0;
    cuisineChrge = 0;

    if (bookingData.reservationType === 'TATKAL') {
        tatkalChrge = 650;
    }

    if (parseInt(bookingData.age) > 3) {
        adultNo = 1;
    } else {
        children = 0;
    }

    if (bookingData.mealType === 'VEG') {
        cuisineChrge = 170;
    } else if (bookingData.mealType === 'NON-VEG') {
        cuisineChrge = 250;
    } else if (bookingData.mealType === 'NO-FOOD') {
        cuisineChrge = 0;
    } else {
        cuisineChrge = 0;
    }
    const completeData = {
        userid: bookingData.userid,
        reservationType: bookingData.reservationType,
        provisionalNumber: provId,
        pnrNumber: 'not yet generated',
        pnrStatus: 'payment not done',
        fromStn: bookingData.fromStn,
        toStn: bookingData.toStn,
        journeyDt: bookingData.journeyDt,
        trainNo: bookingData.trainNo,
        coachNo: 'not allotted',
        seatNo: 'not allotted',
        bookingDt: bookingData.bookingDt,
        bookingStatus: 'not paid',
        name: bookingData.name,
        age: bookingData.age,
        adult: adultNo.toString(),
        child: children.toString(),
        gender: bookingData.gender,
        mobile: bookingData.mobile,
        address: bookingData.address,
        quotaType: bookingData.quotaType,
        nationality: bookingData.nationality,
        identitytype: bookingData.identitytype,
        identityNumber: bookingData.identityNumber,
        berth: bookingData.berth,
        class: bookingData.class,
        mealType: bookingData.mealType,
        concessions: bookingData.concessions,
        baseFare: "not calculated",
        cateringCharge: cuisineChrge.toString(),
        reservationCharge: "40",
        tatkalCharge: tatkalChrge.toString(),
        gst: "not calculated",
        totalFare: "not calculated",
        TransactionId: 'payment not done',
        debitCardId: 'payment not done',
        payersDetl: 'payment not done',
        cardValidDt: 'payment not done',
        paymentDt: 'payment not done',
        payConfirmation: 'payment not done'
    };

    calculateFare(completeData, res);
});

// Get Payment Details after Calculated

router.post('/api/payment/getDetails', function(req, res) {
    const provId = req.body;

    Bookings.generatePayouts(provId.provisionalNumber, function(err, payment) {
        if (err)
            console.log('Error occured: --------> ' + err);
        else {
            res.send(payment);
        }
    });
});

// Payment Verification if it is successful or failed

router.post('/api/payment/verify', function(req, res) {
    const otpDetails = req.body;
    const new_session = uuidv4();
    const new_otp = genOTP();


    messagingData = {
        userid: otpDetails.identifier,
        mobile: '',
        session_id: new_session,
        otp: new_otp,
        type: 'Payment Transaction',
        status: 'Not Verified',
        pnrStatus: 'Generating PNR',
        bookingStatus: 'Payment process initiated',
        trainNo: otpDetails.trainNo,
        provisionalNumber: otpDetails.provisionalNumber,
        totalFare: otpDetails.totalFare,
        debitCardId: otpDetails.cardNo,
        payersDetl: otpDetails.holder_name,
        cardValidDt: otpDetails.validTill
    };

    Users.basicDetls(messagingData.userid, function(err, user) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            messagingData.mobile = user.phone;
            console.log(messagingData.mobile);
            const otp_create = {
                email: messagingData.userid,
                session_id: messagingData.session_id,
                otpn: messagingData.otp,
                type: messagingData.type,
                status: messagingData.status
            };
            RqOTP.requestOTPGeneration(otp_create);
            console.log("OTP Created");
            const update_booking = {
                "pnrStatus": messagingData.pnrStatus,
                "bookingStatus": messagingData.bookingStatus,
                "debitCardId": messagingData.debitCardId,
                "payersDetl": messagingData.payersDetl,
                "cardValidDt": messagingData.cardValidDt
            };
            Booking.update_with_OTP(messagingData.provisionalNumber, update_booking, function(err) {
                if (err) {
                    console.log('Error occured: --------> ' + err);
                } else {
                    console.log("Update Successful");
                    const smsBody = 'OTP for payment is ' + messagingData.otp + ', for booking against Train No - ' + messagingData.trainNo + '. The provisional booking number is ' + messagingData.provisionalNumber;
                    console.log(smsBody);
                    sendTransactionalMsg(messagingData.session_id, '+91', messagingData.mobile, smsBody, res);
                }
            });

        }

    });

});

// Checks if the user is verified User to proceed further for Bookings

router.post('/api/payment/verifiedUser', function(req, res) {
    const bodyParams = req.body;

    const bookingUpdates = {
        provisionalNumber: bodyParams.provisionalNumber,
        pnrNumber: genProvId(),
        pnrStatus: 'BOOKING SUCCESSFUL',
        coachNo: Math.random().toString().slice(2, 7),
        seatNo: Math.random().toString().slice(2, 6),
        bookingStatus: 'BOOKED',
        TransactionId: tranID(),
        paymentDt: Date.now(),
        payConfirmation: 'PAYMENT VERIFIED'
    };

    RqOTP.verifyResponse(bodyParams.identifier, bodyParams.session_id, bodyParams.otp, function(err, otpDetails) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            if (otpDetails != null) {
                otp_id = otpDetails._id;
                RqOTP.updateStatus(otp_id, function(err) {
                    if (err) {
                        console.log('Error occured: --------> ' + err);
                    } else {
                        Booking.confirmBooking(bookingUpdates, function(err) {
                            if (err) {
                                console.log('Error occured: --------> ' + err);
                            } else {
                                //sendEmailConfirmation(bodyParams.identifier, bookingUpdates.pnrNumber);

                                const mes_notify = {
                                    userid: bodyParams.identifier,
                                    dateOfCreation: Date.now(),
                                    title: 'Booking Confirmed and Payment Successful',
                                    description: 'Your Booking against Provisional Booking number: ' + bookingUpdates.provisionalNumber + ' is Successful and your transaction id: ' + bookingUpdates.TransactionId + '. PNR number generated! PNR number: ' + bookingUpdates.pnrNumber,
                                    status: 'UNREAD'
                                }
                                Notify.createNotification(mes_notify);

                                smsBody = 'Transaction Successful. ₹ ' + bodyParams.totalFare + ' debited frm ur A/c. PNR NO: ' + bookingUpdates.pnrNumber + '. Thanks for choosing RRS.'
                                sendSmsConfirmation(bodyParams.identifier, smsBody, res);
                            }
                        })
                    }
                });
            }
        }
    });
});

// Post Booking History

router.post('/api/booking/history', function(req, res) {
    const user_s = req.body;
    const userid = user_s.identifier;

    var fullyBooked = [];
    Booking.myBookings(userid, function(err, bookings) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {

            bookings.forEach((booking) => {

                let bookingDetls = {
                    userid: userid,
                    basic: {
                        _id: booking._id,
                        pnrNumber: booking.pnrNumber,
                        trainNo: booking.trainNo,
                        trainName: 'traintable',
                        quotaType: booking.quotaType,
                        provisionalNumber: booking.provisionalNumber,
                        dateOfBooking: booking.bookingDt,
                        class: booking.class,
                        fromStn: booking.fromStn,
                        dateOfJourney: booking.journeyDt,
                        toStn: booking.toStn,
                        boardingFrom: booking.fromStn,
                        dateOfBoarding: booking.journeyDt,
                        scheduledDeparture: 'traintable',
                        reservationUpto: booking.toStn,
                        adult: booking.adult,
                        child: booking.child,
                        mobile: booking.mobile,
                        address: booking.address
                    },
                    fareDetls: {
                        TransactionId: booking.TransactionId,
                        baseFare: booking.baseFare,
                        reservationCharge: booking.reservationCharge,
                        tatkalCharge: booking.tatkalCharge,
                        cateringCharge: booking.cateringCharge,
                        gst: booking.gst,
                        totalFare: booking.totalFare,
                    },
                    passengerDetls: {
                        name: booking.name,
                        age: booking.age,
                        gender: booking.gender,
                        concessions: booking.concessions,
                        bookingStatus: booking.bookingStatus,
                        coachNo: booking.coachNo,
                        seatNo: booking.seatNo,
                        berth: booking.berth
                    }
                };

                fullyBooked.push(bookingDetls);
            });

            var trains_searched = [];
            fullyBooked.forEach((booking_temp) => {
                let trains_temp = {
                    "trainNo": parseInt(booking_temp.basic.trainNo)
                };

                trains_searched.push(trains_temp);
            });

            Trains.getTrainName_DepAtFromStn(trains_searched, function(err, trains_found) {
                if (err) {
                    console.log('Error occured: --------> ' + err);
                } else {

                    fullyBooked.forEach((booking_temp) => {
                        let train_no = parseInt(booking_temp.basic.trainNo);

                        trains_found.forEach((train_s) => {
                            if (train_s.trainNo === train_no) {
                                booking_temp.basic.trainName = train_s.trainName;
                                booking_temp.basic.scheduledDeparture = train_s.depAtFromStn;
                            }
                        });
                    });

                    res.json(fullyBooked);
                }
            });
        }

    });

});

// GEt BOoking History

router.get('/api/booking/history', (req, res) => {
    Bookings.find({}).then((bookings) => {
        res.send(bookings)

    })
})

// Delete Booking History or Cancel Ticket

router.delete('/api/booking/history/:_id', (req, res) => {
    if (!ObjectId.isValid(req.params._id)) {
        return res.status(400).send('No Record with given id: ${req.params._id}')
    } else {
        Bookings.findByIdAndRemove(req.params._id, (err, doc) => {
            if (!err) {
                res.send(doc);
            } else {
                console.log(err);
            }
        });
    }
});

// PNR Search 

router.post('/api/booking/pnr/search', function(req, res) {
    const userid = req.body.identifier;
    const pnr = req.body.pnrNumber;

    var fullyBooked = [];
    Booking.pnrSearch(userid, pnr, function(err, bookings) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {

            bookings.forEach((booking) => {

                let bookingDetls = {
                    userid: userid,
                    basic: {
                        pnrNumber: booking.pnrNumber,
                        trainNo: booking.trainNo,
                        trainName: 'traintable',
                        quotaType: booking.quotaType,
                        provisionalNumber: booking.provisionalNumber,
                        dateOfBooking: booking.bookingDt,
                        class: booking.class,
                        fromStn: booking.fromStn,
                        dateOfJourney: booking.journeyDt,
                        toStn: booking.toStn,
                        boardingFrom: booking.fromStn,
                        dateOfBoarding: booking.journeyDt,
                        scheduledDeparture: 'traintable',
                        reservationUpto: booking.toStn,
                        adult: booking.adult,
                        child: booking.child,
                        mobile: booking.mobile,
                        address: booking.address
                    },
                    fareDetls: {
                        TransactionId: booking.TransactionId,
                        baseFare: booking.baseFare,
                        reservationCharge: booking.reservationCharge,
                        tatkalCharge: booking.tatkalCharge,
                        cateringCharge: booking.cateringCharge,
                        gst: booking.gst,
                        totalFare: booking.totalFare,
                    },
                    passengerDetls: {
                        name: booking.name,
                        age: booking.age,
                        gender: booking.gender,
                        concessions: booking.concessions,
                        bookingStatus: booking.bookingStatus,
                        coachNo: booking.coachNo,
                        seatNo: booking.seatNo,
                        berth: booking.berth
                    }
                };

                fullyBooked.push(bookingDetls);
            });

            var trains_searched = [];
            fullyBooked.forEach((booking_temp) => {
                let trains_temp = {
                    "trainNo": parseInt(booking_temp.basic.trainNo)
                };

                trains_searched.push(trains_temp);
            });

            Trains.getTrainName_DepAtFromStn(trains_searched, function(err, trains_found) {
                if (err) {
                    console.log('Error occured: --------> ' + err);
                } else {

                    fullyBooked.forEach((booking_temp) => {
                        let train_no = parseInt(booking_temp.basic.trainNo);

                        trains_found.forEach((train_s) => {
                            if (train_s.trainNo === train_no) {
                                booking_temp.basic.trainName = train_s.trainName;
                                booking_temp.basic.scheduledDeparture = train_s.depAtFromStn;
                            }
                        });
                    });

                    res.json(fullyBooked);
                }
            });
        }

    });
});

// Calculate Fare

function calculateFare(bookingData, res) {
    baseCharge = 0;
    Trains.baseFares(bookingData.trainNo, function(err, train) {
        if (err)
            console.log('Error occured: --------> ' + err);
        else {
            if (bookingData.class == '1A') {
                baseCharge = parseInt(train.AC1Tier);
            } else if (bookingData.class == '2A') {
                baseCharge = parseInt(train.AC2Tier);
            } else {
                baseCharge = parseInt(train.sleeperClass);
            }

            totalCharge = baseCharge + parseInt(bookingData.cateringCharge) + parseInt(bookingData.reservationCharge) + parseInt(bookingData.tatkalCharge);
            if (bookingData.child === '1')
                totalCharge = totalCharge / 2;
            gst = Math.round(totalCharge * 0.18);
            fare = Math.round(totalCharge + gst);

            bookingData.baseFare = baseCharge.toString();
            bookingData.gst = gst.toString();
            bookingData.totalFare = fare.toString();

            createBookings(bookingData, res);
        }
    });
}

// Create Booking  Callback Functions

function createBookings(bData, res) {
    Booking.createBooking(bData);

    const responseId = {
        'provisionalNumber': bData.provisionalNumber,
    }
    res.send(responseId);
}

// Send SMS Confirmation

function sendSmsConfirmation(identifier, smsBody, res) {
    Users.basicDetls(identifier, function(err, user) {

        receiver_N = '+91' + user.phone;
        otp_message = smsBody;
        console.log("Sending OTP to " + receiver_N);


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


    });
}


// Send Transactional Message

function sendTransactionalMsg(session_id, countryCode, rec_number, smsBody, res) {
    receiver_N = countryCode + rec_number;
    hashed_N = countryCode + ' ***** *' + rec_number.substring(6, rec_number.length);
    otp_message = smsBody;
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

// Create Notification

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

// View Notification

router.post('/api/notification/view', function(req, res) {
    Notify.notificationUnRead(req.body.identifier, function(err, notify) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            res.send(notify);
        }
    });
});

// Read Notification

router.post('/api/notification/read', function(req, res) {
    Notify.notificationRead(req.body.idrq, req.body.identifier, function(err) {
        if (err) {
            console.log('Error occured: --------> ' + err);
        } else {
            res.sendStatus(200);
        }
    });
});


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function genOTP() {
    return 'xxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function tranID() {
    return 'xxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function genProvId() {
    return Math.random().toString().slice(2, 11);
}


module.exports = router;