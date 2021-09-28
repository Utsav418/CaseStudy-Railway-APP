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