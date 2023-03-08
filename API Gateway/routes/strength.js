require("dotenv").config();
const express = require("express");
const FITNESS_PORT = process.env.FITNESS_PORT;

const router = express.Router();
const fitnessURL = `http://localhost:${FITNESS_PORT}/exercise/strength`;
let fitnessRequest;
let fitnessResponse;

/* Get Strength exercise by ID */
router.get("/:exerciseId", async (request, response) => {
	if (request.params.exerciseId) {
		fitnessRequest = `${fitnessURL}/${request.params.exerciseId}`;
		fitnessResponse = await fetch(fitnessRequest, {
			method: "GET",
		}).then((response) => response.json());
	}
	// console.log(fitnessResponse);
	response.send(fitnessResponse);
});

/* Get Cardio by Exercise Name */
router.get("/", async (request, response) => {
	if (request.query.search) {
		fitnessRequest = `${fitnessURL}/?search=${request.query.search}`;
		fitnessResponse = await fetch(fitnessRequest, {
			method: "GET",
		}).then((response) => response.json());
	} 
	response.send(fitnessResponse);
});

module.exports = router;
