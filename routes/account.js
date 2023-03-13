require("dotenv").config();
const util = require("../util");
const express = require("express");
const AUTH_URL = process.env.AUTH_URL;
const PROFILE_URL = process.env.PROFILE_URL;

const router = express.Router();
let authRequest;
let authResponse;
let accountRequest;
let accountResponse;

/* Post Account Creation */
router.post("/createAccount", async (request, response) => {
	// accountRequest = `${accountURL}/createAccount`;
	// accountResponse = await fetch(accountRequest, {
	// 	method: "POST",
	// 	headers: { "Content-Type": "application/json" },
	// 	body: JSON.stringify(request.body),
	// }).then((res) => {
	// 	response.status(res.status);
	// 	return res.json();
	// });
	authRequest = `${AUTH_URL}/createAccount`;
	authResponse = await fetch(authRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	}).then((res) => {
		response.status(res.status);
		return res.json();
	});

	response.send(authResponse);
});

/* Post User Login */
router.post("/login", async (request, response) => {
	authRequest = `${AUTH_URL}/login`;
	authResponse = await fetch(authRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	}).then((res) => {
		response.status(res.status);
		return res.json();
	});

	response.send(authResponse);
});

/* POST a new access token given a refresh token */
router.post("/newToken", async (request, response) => {
	console.log(request.body);
	console.log(JSON.stringify(request.body));
	authRequest = `${AUTH_URL}/newToken`;
	authResponse = await fetch(authRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	}).then((res) => {
		response.status(res.status);
		return res.json();
	});

	response.send(authResponse);
});

/* Put to Change Password */
router.put("/changePassword", util.AuthTokenMiddleware, async (request, response) => {
	authRequest = `${AUTH_URL}/changePassword`;
	authResponse = await fetch(authRequest, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	}).then((res) => {
		response.status(res.status);
		return res.json();
	});

	response.send(authResponse);
});

/* DELETE to Delete Account */
router.delete("/deleteAccount", util.AuthTokenMiddleware, async (request, response) => {
	authRequest = `${AUTH_URL}/deleteAccount`;
	authResponse = await fetch(authRequest, {
		method: "DELETE",
		headers: { Authorization: request.get("Authorization") },
	}).then((res) => {
		response.status(res.status);
		return res.json();
	});

	response.send(authResponse);
});

module.exports = router;
