function createBookings(bData, res) {
    Booking.createBooking(bData);

    const responseId = {
        'provisionalNumber': bData.provisionalNumber,
    }
    res.send(responseId);
}

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