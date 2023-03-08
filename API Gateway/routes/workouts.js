require("../util")
require("dotenv").config();
const express = require("express");
const FITNESS_URL = process.env.FITNESS_URL;

const router = express.Router();
const fitnessURL = `${FITNESS_URL}/workouts`;
let fitnessRequest;
let fitnessResponse;

/* Get all workouts for a User */
router.get("/", async (request, response) => {

	fitnessRequest = request.query.userId ? `${fitnessURL}/?userId=${request.query.userId}` : fitnessURL;

	fitnessResponse = await fetch(fitnessRequest, {
		method: "GET"
	}).then((response) => response.json())


	response.send(fitnessResponse)

})

/* Get workout by Id */
router.get("/:workoutId", async (request, response) => {

	// Authenticate this please 🥺

	fitnessRequest = `${fitnessURL}/${request.params.workoutId}`;
	fitnessResponse = await fetch(fitnessRequest, {
		method: "GET"
	}).then((response => response.json()))

	response.send(fitnessResponse)
})

/* Post a new workout for a User */
router.post("/", async (request, response) => {

	// Authenticate this please 🥺	
	fitnessRequest = fitnessURL
	fitnessResponse = await fetch(fitnessRequest, {
		method: "POST",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(request.body)
	}).then((response => response.json()))

	response.send(fitnessResponse)
})

/* Patch a workout from a User */
router.patch("/:workoutId", async (request, response) => {

	// Authenticate this please 🥺

	fitnessRequest = request.params.workoutId ? `${fitnessURL}/${request.params.workoutId}` : fitnessURL;
	fitnessResponse = await fetch(fitnessRequest, {
		method: "PATCH",
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(request.body)
	}).then((response => response.json()))

	response.send(fitnessResponse)
})

/* Delete a workout from a User */
router.delete("/:workoutId", async (request, response) => {

	// Authenticate this please 🥺

	fitnessRequest = request.params.workoutId ? `${fitnessURL}/${request.params.workoutId}` : fitnessURL;

	fitnessResponse = await fetch(fitnessRequest, {
		method: "DELETE",
	}).then((response => response.json()))
	
	response.send(fitnessResponse)
})


module.exports = router;
