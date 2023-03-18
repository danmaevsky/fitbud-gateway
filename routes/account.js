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
	console.log("Response from Auth API:", authResponse);

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
	console.log("Response from Profile API:", profileResponse);

	console.log("authStatus:", authStatus);
	console.log("Message from Auth:", authResponse ? authResponse.message : authResponse);
	console.log("profileStatus:", profileStatus);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
	// if both calls failed
	if (authStatus !== 201 && profileStatus !== 201) {
		console.log("Account creation failed.");
		return response.status(400).send({ message: "Account creation failed. Bad request. (1)" });
	}

	// if only auth call failed
	if (authStatus !== 201 && profileStatus === 201) {
		// rollback changes done in Profile database
		console.log("profile creation rolling back...");
		await fetch(`${PROFILE_URL}/deleteProfile`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId: profileResponse.userId }),
		})
			.then((res) => {
				console.log(res.status === 200 ? "profile creation rolled back successfully" : "profile creation rollback failed...");
			})
			.catch((err) => {
				return response.status(500).send({ message: err.message });
			});
		return response.status(400).send({ message: "Account creation failed. Bad request. (2)" });
	}

	// if only profile call failed
	if (authStatus === 201 && profileStatus !== 201) {
		// rollback changes done in Auth database
		console.log("auth account creation rolling back...");
		await fetch(`${AUTH_URL}/rollback`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ userId: authResponse.userId }),
		})
			.then((res) => {
				console.log(res.status === 200 ? "auth account creation rolled back successfully" : "auth account creation rollback failed...");
			})
			.catch((err) => {
				return response.status(500).send({ message: err.message });
			});
		return response.status(400).send({ message: "Account creation failed. Bad request. (3)" });
	}

	// if everything was good, then send back authResponse which contains userId
	console.log("Account created successfully");
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
			console.log("Internal Error in 'POST /login':", err);
			response.status(500).send({ message: err.message });
		});
	console.log("Response from Auth API:", authResponse);
	console.log("Message from Auth:", authResponse ? authResponse.message : authResponse);

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
			console.log("Internal Error in 'POST /logout':", err);
			response.status(500).send({ message: err.message });
		});
	console.log("Response from Auth API:", authResponse);
	console.log("Message from Auth:", authResponse ? authResponse.message : authResponse);

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
			console.log("Internal Error in 'POST /newToken':", err);
			response.status(500).send({ message: err.message });
		});
	console.log("Response from Auth API:", authResponse);
	console.log("Message from Auth:", authResponse ? authResponse.message : authResponse);
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
	console.log("Response from Auth API:", authResponse);
	console.log("Message from Auth:", authResponse ? authResponse.message : authResponse);
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
