// Helper function for authenticating JWTs
export async function AuthenticateToken(request, authURL) {
    if (!request.get("Authorization")) {
        return false;
    } else {
        let { authorized } = await fetch(authURL, {
            method: "POST",
            body: {
                token: request.get("Authorization"),
            },
        }).then((res) => res.json());
        return authorized;
    }
}

export async function UserMatchesToken(request) {
    // Some code for parsing the JSON Web Token and seeing if
}
