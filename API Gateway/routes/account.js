require("dotenv").config();
require("../util");
const express = require("express");
const ACCOUNT_URL = process.env.ACCOUNT_URL;

const router = express.Router();
const accountURL = `${ACCOUNT_URL}/account`;
let accountRequest;
let accountResponse;

/* Post Account Creation */
router.post("/createAccount", async (request, response) => {
    accountRequest = `${accountURL}/createAccount`;
    accountResponse = await fetch(accountRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request.body),
    }).then((res) => {
        response.status(res.status);
        return res.json();
    });

    response.send(accountResponse);
});

/* Post User Login */
router.post("/login", async (request, response) => {
    accountRequest = `${accountURL}/login`;
    accountResponse = await fetch(accountRequest, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request.body),
    }).then((res) => {
        response.status(res.status);
        return res.json();
    });

    response.send(accountResponse);
});

/* Put to Change Password */
router.put("/changePassword", async (request, response) => {
    accountRequest = `${accountURL}/changePassword`;
    accountResponse = await fetch(accountRequest, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request.body),
    }).then((res) => {
        response.status(res.status);
        return res.json();
    });

    response.send(accountResponse);
});

module.exports = router;
