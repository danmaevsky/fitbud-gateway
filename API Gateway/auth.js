require("dotenv").config();
const AUTH_URL = process.env.AUTH_URL;

module.exports.AuthenticateToken = async function AuthenticateToken(request, response, next) {
    let bearerToken = request.get("Authorization");
    if (!bearerToken) {
        let err = new Error("Authentication Failed! No access token.");
        err.status = 401;
        return next(err);
    } else {
        let authResponse = await fetch(AUTH_URL, {
            method: "POST",
            headers: { Authorization: bearerToken },
        });
        let status = authResponse.status;
        if (status === 200) {
            return next();
        } else {
            let message = await authResponse.json();
            console.log(message);
            let err = new Error("Authentication Failed!");
            err.status = 401;
            response.status(authResponse.status).send(message);
            return next(err);
        }
    }
};
