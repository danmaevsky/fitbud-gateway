// Helper function for authenticating JWTs

async function AuthenticateToken(request, response, next) {
    if (!request.get("Authorization")) {
        return false;
    } else {
        let { authorized } = await fetch(authURL, {
            method: "POST",
            body: {
                token: request.get("Authorization"),
            },
        }).then((res) => {
            response.status(res.status);
            return res.json();
        });
        return authorized;
    }
}

async function UserMatchesToken(request) {
    // Some code for parsing the JSON Web Token and seeing if
}
