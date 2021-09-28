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