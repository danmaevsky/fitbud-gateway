require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const util = require("../util");
const multer = require("multer")
const upload = multer()
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

/* GET a profile picture */
router.get("/users/profilePicture", util.AuthTokenMiddleware, async (request, response) => {

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
			return res.json()
		});


	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}


	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);

	response.status(profileStatus).send(profileResponse);

})

router.post("/users/profilePicture", util.AuthTokenMiddleware, upload.any(), async (request, response) => {

	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;

	const formData = new FormData();
	formData.append("image", request.file)

	profileRequest = `${PROFILE_URL}/profilePicture/${userId}`;

	console.log(request)

	console.log(formData)

	try {
		profileResponse = await fetch(profileRequest, {
			method: "POST",
			body: formData
		}).then((res) => {
			console.log("Profile Response Status:", res.status);
			response.status(res.status);
			profileStatus = res.status;
			return res.json();
		})
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}

	console.log("Response from Profile API:", profileResponse);
	console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);

	response.status(profileStatus).send(profileResponse);

})

module.exports = router;
