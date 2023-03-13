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
        }).then((res) => {
            response.status(res.status);
            return res.json();
        });
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
        }).then((res) => {
            response.status(res.status);
            return res.json();
        });
    }
    response.send(fitnessResponse);
});

module.exports = router;