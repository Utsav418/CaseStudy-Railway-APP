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