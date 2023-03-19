require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;

const router = express.Router();
const fitnessURL = `${FITNESS_URL}/exercise/strength`;
let fitnessRequest;
let fitnessResponse;

/* Get Strength exercise by ID */
router.get("/:exerciseId", async (request, response) => {
	if (request.params.exerciseId) {
		fitnessRequest = `${fitnessURL}/${request.params.exerciseId}`;
		try {
			fitnessResponse = await fetch(fitnessRequest, {
				method: "GET",
			}).then((res) => {
				console.log("Strength Response Status:", res.status);
				response.status(res.status);
				return res.json();
			});
		} catch (err) {
			console.log("Caught Error in Gateway:", err.message);
			return response.status(500).send({ message: err.message });
		}
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	response.send(fitnessResponse);
});

/* Get Cardio by Exercise Name */
router.get("/", async (request, response) => {
	if (request.query.search) {
		fitnessRequest = `${fitnessURL}/?search=${request.query.search}`;
		try {
			fitnessResponse = await fetch(fitnessRequest, {
				method: "GET",
			}).then((res) => {
				console.log("Strength Response Status:", res.status);
				response.status(res.status);
				return res.json();
			});
		} catch (err) {
			console.log("Caught Error in Gateway:", err.message);
			return response.status(500).send({ message: err.message });
		}
	} else {
		return response.status(400).send({ message: "Bad Request" });
	}
	response.send(fitnessResponse);
});

module.exports = router;
