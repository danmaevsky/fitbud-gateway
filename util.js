const jwt = require("jsonwebtoken");

// Helper function for authenticating JWTs
const AUTH_URL = process.env.AUTH_URL;
module.exports.AuthTokenMiddleware = async function AuthenticateToken(request, response, next) {
    let bearerToken = request.get("Authorization");
    let authResponse = await fetch(`${AUTH_URL}/auth`, {
        method: "POST",
        headers: { Authorization: bearerToken },
    });
    let status = authResponse.status;
    if (status === 200) {
        return next();
    } else {
        let message = await authResponse.json();
        response.status(status).send(message);
    }
};
module.exports.AuthenticateToken = async function AuthenticateToken(request, response, next) {
    let bearerToken = request.get("Authorization");
    let authResponse = await fetch(`${AUTH_URL}/auth`, {
        method: "POST",
        headers: { Authorization: bearerToken },
    });
    let status = authResponse.status;
    if (status !== 200) {
        let message = await authResponse.json();
        response.status(status).send(message);
    }
    return status;
};
