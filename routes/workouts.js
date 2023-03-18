const util = require("../util");
require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;

const router = express.Router();
const fitnessURL = `${FITNESS_URL}/workouts`;
let fitnessRequest;
let fitnessResponse;

/* Get all workouts for a User */
router.get("/", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;

	fitnessRequest = `${fitnessURL}/?userId=${userId}`;
	fitnessResponse = await fetch(fitnessRequest, {
		method: "GET",
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});
	console.log("Response from Fitness API:", fitnessResponse);
	console.log("Message from Fitness:", fitnessResponse ? fitnessResponse.message : fitnessResponse);
	response.send(fitnessResponse);
});

/* Get workout by Id */
router.get("/:workoutId", util.AuthTokenMiddleware, async (request, response) => {
	fitnessRequest = `${fitnessURL}/${request.params.workoutId}`;
	fitnessResponse = await fetch(fitnessRequest, {
		method: "GET",
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});

	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	if (userId !== fitnessResponse.userId) {
		console.log(`userId in accessToken (${userId}) does not match userId in query parameters (${request.query.userId})`);
		response.status(401).send({ message: "Not permitted to view workouts that do not belong to you!" });
	}
	console.log("Response from Fitness API:", fitnessResponse);
	console.log("Message from Fitness:", fitnessResponse ? fitnessResponse.message : fitnessResponse);
	response.send(fitnessResponse);
});

/* Post a new workout for a User */
router.post("/", util.AuthTokenMiddleware, async (request, response) => {
	let token = request.get("Authorization").split(" ")[1];
	let userId = jwt.decode(token).userId;
	fitnessRequest = fitnessURL;

	let workoutRequestBody = {
		userId: userId,
		...request.body,
	};

	fitnessResponse = await fetch(fitnessRequest, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(workoutRequestBody),
	})
		.then((res) => {
			response.status(res.status);
			return res.json();
		})
		.catch((err) => {
			response.status(500).send({ message: err.message });
		});
	console.log("Response from Fitness API:", fitnessResponse);
	console.log("Message from Fitness:", fitnessResponse ? fitnessResponse.message : fitnessResponse);
	response.send(fitnessResponse);
});

/* Patch a workout from a User */
router.patch("/:workoutId", util.AuthTokenMiddleware, async (request, response) => {
	if (request.params.workoutId) {
		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;

		fitnessRequest = `${fitnessURL}/${request.params.workoutId}`;
		let workoutRequestBody = {
			userId: userId,
			...request.body,
		};

		fitnessResponse = await fetch(fitnessRequest, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(workoutRequestBody),
		})
			.then((res) => {
				response.status(res.status);
				return res.json();
			})
			.catch((err) => {
				response.status(500).send({ message: err.message });
			});
	} else {
		console.log("Bad Request");
		return response.status(400).send({ message: "Bad Request" });
	}
	console.log("Response from Fitness API:", fitnessResponse);
	console.log("Message from Fitness:", fitnessResponse ? fitnessResponse.message : fitnessResponse);
	response.send(fitnessResponse);
});

/* Delete a workout from a User */
router.delete("/:workoutId", util.AuthTokenMiddleware, async (request, response) => {
	if (request.params.workoutId) {
		let token = request.get("Authorization").split(" ")[1];
		let userId = jwt.decode(token).userId;
		fitnessRequest = `${fitnessURL}/${request.params.workoutId}`;

		fitnessResponse = await fetch(fitnessRequest, {
			method: "DELETE",
			body: JSON.stringify({ userId: userId }),
		})
			.then((res) => {
				response.status(res.status);
				return res.json();
			})
			.catch((err) => {
				response.status(500).send({ message: err.message });
			});
	} else {
		console.log("Bad Request");
		return response.status(400).send({ message: "Bad Request" });
	}
	console.log("Response from Fitness API:", fitnessResponse);
	console.log("Message from Fitness:", fitnessResponse ? fitnessResponse.message : fitnessResponse);
	response.send(fitnessResponse);
});

module.exports = router;
