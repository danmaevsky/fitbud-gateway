require("dotenv").config();
const jwt = require("jsonwebtoken");
const util = require("../util");
const express = require("express");
const AUTH_URL = process.env.AUTH_URL;
const PROFILE_URL = process.env.PROFILE_URL;

const router = express.Router();
let authRequest;
let authResponse;
let profileRequest;
let profileResponse;

/* Post Account Creation */
router.post("/createAccount", async (request, response) => {
	let authStatus;
	authRequest = `${AUTH_URL}/createAccount`;
	authResponse = await fetch(authRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: request.body.email, password: request.body.password }),
	})
		.then((res) => {
			authStatus = res.status;
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});

	let profileStatus;
	profileRequest = `${PROFILE_URL}/createProfile`;
	profileResponse = await fetch(profileRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ...request.body, userId: authResponse.userId }),
	})
		.then((res) => {
			profileStatus = res.status;
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});

	// if both calls failed
	if (authStatus !== 201 && profileStatus !== 201) {
		return response.status(400).send({ message: "Account creation failed. Bad request. (1)" });
	}

	// if only auth call failed
	if (authStatus !== 201 && profileStatus === 201) {
		// rollback changes done in Profile database
		await fetch(`${PROFILE_URL}/deleteProfile`, {
			method: "DELETE",
			body: { userId: profileResponse.userId },
		}).catch((err) => {
			return response.status(500).send({ message: err.message });
		});
		return response.status(400).send({ message: "Account creation failed. Bad request. (2)" });
	}

	// if only profile call failed
	if (authStatus === 201 && profileStatus !== 201) {
		// rollback changes done in Auth database
		await fetch(`${AUTH_URL}/deleteAccount`, {
			method: "DELETE",
			body: { userId: authResponse.userId },
		}).catch((err) => {
			return response.status(500).send({ message: err.message });
		});
		return response.status(400).send({ message: "Account creation failed. Bad request. (3)" });
	}

	// if everything was good, then send back authResponse which contains userId
	response.status(201).send(authResponse);
});

/* Post User Login */
router.post("/login", async (request, response) => {
	authRequest = `${AUTH_URL}/login`;
	authResponse = await fetch(authRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});

	response.send(authResponse);
});

/* Post User Logout */
router.post("/logout", util.AuthTokenMiddleware, async (request, response) => {
	authRequest = `${AUTH_URL}/logout`;
	authResponse = await fetch(authRequest, {
		method: "POST",
		headers: { Authorization: request.get("Authorization") },
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});

	response.send(authResponse);
});

/* POST a new access token given a refresh token */
router.post("/newToken", async (request, response) => {
	authRequest = `${AUTH_URL}/newToken`;
	authResponse = await fetch(authRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request.body),
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
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
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});

	response.send(authResponse);
});

/* DELETE to Delete Account */
router.delete("/deleteAccount", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	authRequest = `${AUTH_URL}/deleteAccount`;
	authResponse = await fetch(authRequest, {
		method: "DELETE",
		headers: { Authorization: request.get("Authorization") },
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});

	// call to Profile API
	profileRequest = `${PROFILE_URL}/users/${userId}`;
	profileResponse = await fetch(profileRequest, {
		method: "DELETE",
	});

	// call to Food API

	// call to Recipe API

	// call to Workout API

	response.send(authResponse);
});

module.exports = router;
