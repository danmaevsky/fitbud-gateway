require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const PROFILE_URL = process.env.PROFILE_URL;

const util = require("../util");
const router = express.Router();
const diaryURL = `${PROFILE_URL}/diary`;
let diaryRequest;
let diaryResponse;
let diaryStatus;

/* Get Diary by ID */

router.get("/:diaryId", util.AuthTokenMiddleware, async (request, response) => {
	if (request.params.diaryId) {
		diaryRequest = `${diaryURL}/${request.params.diaryId}`;
	} else if (request.query.date) {
		diaryRequest = `${diaryURL}/?date=${request.query.date}`;
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}

	try {
		diaryResponse = await fetch(diaryRequest, {
			method: "GET",
		}).then((res) => {
			console.log("Diary Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
		console.log("Message From Diary:", diaryResponse.message);
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}

	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;

	if (userId !== diaryResponse.userId) {
		console.log(`userId in accessToken (${userId}) does not match userId in response (${diaryResponse.userId})`);
		return response.status(401).send({ message: "Not permitted to view diaries that do not belong to you!" });
	}

	return response.send(diaryResponse);
});

/* Get Diary by Query Parameters "userId" and "date" */
router.get("/", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;

	if (request.query.date) {
		diaryRequest = `${diaryURL}/?userId=${userId}&date=${request.query.date}`;
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}

	try {
		diaryResponse = await fetch(diaryRequest, {
			method: "GET",
		}).then((res) => {
			console.log("Diary Response Status:", res.status);
			response.status(res.status);
			diaryStatus = res.status;
			return res.json();
		});
		console.log("Message From Diary:", diaryResponse.message);
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}

	if (diaryStatus !== 200) {
        return response.status(diaryStatus).send(diaryResponse);
    }

	if (!userId || userId !== diaryResponse.userId) {
		console.log(`userId in accessToken (${userId}) does not match userId in response (${diaryResponse.userId})`);
		return response.status(401).send({ message: "Not permitted to view diaries that do not belong to you!" });
	}

	return response.send(diaryResponse);
});

/* Post Diary */
router.post("/", util.AuthTokenMiddleware, async (request, response) => {
	if (request.query.date) {
		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;

		let diaryRequestBody = {
			userId: userId,
			...request.body,
		};
		diaryRequest = `${diaryURL}/?date=${request.query.date}`;
		// try-catch instead of .catch because we need to return from the call
		try {
			diaryResponse = await fetch(diaryRequest, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(diaryRequestBody),
			}).then((res) => {
				console.log("Diary Response Status:", res.status);
				response.status(res.status);
				return res.json();
			});
			console.log("Message From Diary:", diaryResponse.message);
		} catch (err) {
			console.log("Caught Error in Gateway:", err.message);
			return response.status(500).send({ message: err.message });
		}
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}

	return response.send(diaryResponse);
});

/* Patch diary */
router.patch("/:diaryId", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;

	let diaryRequestBody = {
		userId: userId,
		...request.body,
	};

	diaryRequest = `${diaryURL}/${request.params.diaryId}`;
	try {
		diaryResponse = await fetch(diaryRequest, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(diaryRequestBody),
		}).then((res) => {
			console.log("Diary Response Status:", res.status);
			response.status(res.status);
			return res.json();
		});
		console.log("Message From Diary:", diaryResponse.message);
	} catch (err) {
		console.log("Caught Error in Gateway:", err.message);
		return response.status(500).send({ message: err.message });
	}

	return response.send(diaryResponse);
});

module.exports = router;
