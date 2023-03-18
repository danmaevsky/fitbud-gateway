require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const util = require("../util");
const PROFILE_URL = process.env.PROFILE_URL;

const router = express.Router();
let profileRequest;
let profileResponse;

/* Get Profile by UserID */
router.get("/users", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	profileRequest = `${PROFILE_URL}/users/${userId}`;
	profileResponse = await fetch(profileRequest, {
		method: "GET",
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).json({ message: err.message });
		});
	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
	response.send(profileResponse);
});

/* Patch Profile by UserId */
router.patch("/users", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	profileRequest = `${PROFILE_URL}/users/${userId}`;
	profileResponse = await fetch(profileRequest, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).json({ message: err.message });
		});
	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
	response.send(profileResponse);
});

module.exports = router;
