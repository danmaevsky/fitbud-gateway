require("dotenv").config();
const AUTH_URL = process.env.AUTH_URL;

module.exports.AuthenticateToken = async function AuthenticateToken(request, response, next) {
  if (!request.get("Authorization")) {
    let err = new Error("Authentication Failed! No access token.");
    err.status = 401;
    return next(err);
  } else {
    let { authorized } = await fetch(AUTH_URL, {
      method: "POST",
      body: {
        token: request.get("Authorization"),
      },
    }).then((res) => res.json());
    if (authorized) {
      return next();
    } else {
      let err = new Error("Authentication Failed!");
      err.status = 401;
      return next(err);
    }
  }
};
