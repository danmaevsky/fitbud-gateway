require("dotenv").config();
const jwt = require("jsonwebtoken");
const util = require("../util");
const express = require("express");
const AUTH_URL = process.env.AUTH_URL;
const FITNESS_URL = process.env.FITNESS_URL;
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
	try {
		authResponse = await fetch(authRequest, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: request.body.email, password: request.body.password }),
		}).then((res) => {
			console.log("Auth Response Status:", res.status);
			authStatus = res.status;
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	!authResponse ? console.log(`Auth response is ${authResponse}`) : null;

	let profileStatus;
	profileRequest = `${PROFILE_URL}/createProfile`;
	try {
		profileResponse = await fetch(profileRequest, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ ...request.body, userId: authResponse.userId }),
		}).then((res) => {
			console.log("Profile Response Status:", res.status);
			profileStatus = res.status;
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	!profileResponse ? console.log(`Profile response is ${profileResponse}`) : null;

	console.log("authStatus:", authStatus);
	console.log("Message from Auth:", authResponse ? authResponse.message : authResponse);
	console.log("profileStatus:", profileStatus);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
	// if both calls failed
	if (authStatus !== 201 && profileStatus !== 201) {
		console.log("Account creation failed. (1)");
		return response.status(400).send({ message: "Account creation failed. Bad request." });
	}

	// if only auth call failed
	if (authStatus !== 201 && profileStatus === 201) {
		// rollback changes done in Profile database
		console.log("profile creation rolling back...");
		try {
			await fetch(`${PROFILE_URL}/deleteProfile`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: profileResponse.userId }),
			}).then((res) => {
				console.log(res.status === 200 ? "profile creation rolled back successfully" : "profile creation rollback failed...");
			});
		} catch (err) {
			console.log("Caught Error in Gateway:", err.message);
			return response.status(500).send({ message: err.message });
		}
		console.log("Account creation failed. (2)");
		return response.status(400).send({ message: "Account creation failed. Bad request." });
	}

	// if only profile call failed
	if (authStatus === 201 && profileStatus !== 201) {
		// rollback changes done in Auth database
		console.log("auth account creation rolling back...");
		try {
			await fetch(`${AUTH_URL}/rollback`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: authResponse.userId }),
			}).then((res) => {
				console.log(res.status === 200 ? "auth account creation rolled back successfully" : "auth account creation rollback failed...");
			});
		} catch (err) {
			console.log("Caught Error in Gateway:", err.message);
			return response.status(500).send({ message: err.message });
		}
		console.log("Account creation failed. (3)");
		return response.status(400).send({ message: "Account creation failed. Bad request." });
	}

	// if everything was good, then send back authResponse which contains userId
	console.log("Account created successfully");
	response.status(201).send(authResponse);
});

/* Post User Login */
router.post("/login", async (request, response) => {
	authRequest = `${AUTH_URL}/login`;
	try {
		authResponse = await fetch(authRequest, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(request.body),
		}).then((res) => {
			console.log("Auth Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	!authResponse ? console.log(`Auth response is ${authResponse}`) : null;
	authResponse ? console.log("Message from Auth:", authResponse ? authResponse.message : authResponse) : null;

	response.send(authResponse);
});

/* Post User Logout */
router.post("/logout", util.AuthTokenMiddleware, async (request, response) => {
	authRequest = `${AUTH_URL}/logout`;
	try {
		authResponse = await fetch(authRequest, {
			method: "POST",
			headers: { Authorization: request.get("Authorization") },
		}).then((res) => {
			console.log("Auth Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	!authResponse ? console.log(`Auth response is ${authResponse}`) : null;
	authResponse ? console.log("Message from Auth:", authResponse ? authResponse.message : authResponse) : null;

	response.send(authResponse);
});

/* POST a new access token given a refresh token */
router.post("/newToken", async (request, response) => {
	authRequest = `${AUTH_URL}/newToken`;
	try {
		authResponse = await fetch(authRequest, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(request.body),
		}).then((res) => {
			console.log("Auth Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	!authResponse ? console.log(`Auth response is ${authResponse}`) : null;
	authResponse ? console.log("Message from Auth:", authResponse ? authResponse.message : authResponse) : null;

	response.send(authResponse);
});

/* Put to Change Password */
router.put("/changePassword", util.AuthTokenMiddleware, async (request, response) => {
	authRequest = `${AUTH_URL}/changePassword`;
	try {
		authResponse = await fetch(authRequest, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(request.body),
		}).then((res) => {
			console.log("Auth Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	!authResponse ? console.log(`Auth response is ${authResponse}`) : null;
	authResponse ? console.log("Message from Auth:", authResponse ? authResponse.message : authResponse) : null;

	response.send(authResponse);
});

/* DELETE to Delete Account */
router.delete("/deleteAccount", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	/* Deleting User's Personal Resources */
	// call to Recipe API
	// DELETE fitness/recipes/?userId
	let recipesRequest = `${FITNESS_URL}/recipes/?userId=${userId}`;
	let recipesResponse = fetch(recipesRequest, {
		method: "DELETE",
	});

	// call to Workout API
	// DELETE fitness/workouts/?userId
	let workoutsRequest = `${FITNESS_URL}/workouts/?userId=${userId}`;
	let workoutsResponse = fetch(workoutsRequest, {
		method: "DELETE",
	});

	let resourceResponseStatuses = await Promise.all([recipesResponse.then((res) => res.status), workoutsResponse.then((res) => res.status)]);
	if (resourceResponseStatuses[0] !== 200 && resourceResponseStatuses[1] !== 200) {
		return response.status(500).send({ message: "Internal Server Error: Account Deletion Failed!" });
	}

	authRequest = `${AUTH_URL}/deleteAccount`;
	try {
		authResponse = await fetch(authRequest, {
			method: "DELETE",
			headers: { Authorization: request.get("Authorization") },
		}).then((res) => {
			console.log("Auth Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}

	// call to Profile API
	profileRequest = `${PROFILE_URL}/users/${userId}`;
	profileResponse = await fetch(profileRequest, {
		method: "DELETE",
	});

	response.send(authResponse);
});

module.exports = router;
