require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const util = require("../util");
const PROFILE_URL = process.env.PROFILE_URL;

const router = express.Router();
let profileRequest;
let profileResponse;
let profileStatus;

/* Get Profile by UserID */
router.get("/users", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	profileRequest = `${PROFILE_URL}/users/${userId}`;
	try {
		profileResponse = await fetch(profileRequest, {
			method: "GET",
		}).then((res) => {
			console.log("Profile Response Status:", res.status);
			response.status(res.status);
			profileStatus = res.status;
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
	response.status(profileStatus).send(profileResponse);
});

/* Patch Profile by UserId */
router.patch("/users", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	profileRequest = `${PROFILE_URL}/users/${userId}`;
	try {
		profileResponse = await fetch(profileRequest, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(request.body),
		}).then((res) => {
			console.log("Profile Response Status:", res.status);
			response.status(res.status);
			profileStatus = res.status;
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}
	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
	response.status(profileStatus).send(profileResponse);
});

router.get("/profilePicture", util.AuthTokenMiddleware, async (request, response) => {

	let blobResponse;
	let blobStatus;
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;

	profileRequest = `${PROFILE_URL}/profilePicture/${userId}`;

	try {
		profileResponse = await fetch(profileRequest, {
			method: "GET",
		}).then((res) => {
			console.log("Profile Response Status:", res.status);
			response.status(res.status);
			profileStatus = res.status;
			return res.json();
		});

		if (profileStatus != 201) {
			return response.status(profileStatus).send(profileResponse);
		}

		blobResponse = await fetch(`${profileResponse.data}`, {
			method: "GET"
		}).then((res) => {
			console.log("Blob Response Status:", res.status);
			response.status(res.status);
			blobStatus = res.status;
			return res.blob();
		}).then((blob) => {
			return URL.createObjectURL(blob);
		})

	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}


	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);

	response.status(profileStatus).send(blobResponse);

})

router.post("/profilePicture", util.AuthTokenMiddleware, async (request, response) => {

	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;

	profileRequest = `${PROFILE_URL}/profilePicture`;
	profileRequestBody = {
		userId: userId,
		...request.body,
	};

	try {
		profileResponse = await fetch(profileRequest, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(profileRequestBody),
		}).then((res) => {
			console.log("Profile Response Status:", res.status);
			response.status(res.status);
			profileStatus = res.status;
			return res.json();
		});
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}

	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);

	response.status(profileStatus).send(profileResponse);

})

module.exports = router;
