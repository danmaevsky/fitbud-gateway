require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;

const router = express.Router();
const fitnessURL = `${FITNESS_URL}/exercise/cardio`;
let fitnessRequest;
let fitnessResponse;

/* Get Cardio exercise by ID */
router.get("/:exerciseId", async (request, response) => {
	if (request.params.exerciseId) {
		fitnessRequest = `${fitnessURL}/${request.params.exerciseId}`;
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
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	console.log("Response from Fitness API:", fitnessResponse);
	console.log("Message from Fitness:", fitnessResponse ? fitnessResponse.message : fitnessResponse);
	response.send(fitnessResponse);
});

/* Get Cardio by Exercise Name */
router.get("/", async (request, response) => {
	if (request.query.search) {
		fitnessRequest = `${fitnessURL}/?search=${request.query.search}`;
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
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	console.log("Response from Fitness API:", fitnessResponse);
	console.log("Message from Fitness:", fitnessResponse ? fitnessResponse.message : fitnessResponse);
	response.send(fitnessResponse);
});

module.exports = router;
