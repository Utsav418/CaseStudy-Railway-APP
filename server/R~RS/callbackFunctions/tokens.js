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