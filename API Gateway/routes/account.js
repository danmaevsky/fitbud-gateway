require("dotenv").config();
require("../util");
const express = require("express");
const ACCOUNT_PORT = process.env.ACCOUNT_PORT;

const router = express.Router();
const accountURL = `http://localhost:${ACCOUNT_PORT}/account`;
let accountRequest;
let accountResponse;

/* Post Account Creation */
router.post("/createAccount", async (request, response) => {

	accountRequest = `${accountURL}/createAccount`;
	accountResponse = await fetch(accountRequest, {
		method: "POST",
		body: request.body
	}).then((response) => response.json());

	reponse.send(fitnessResponse);

})

/* Post User Login */
router.post("/login", async (request, response) => {

	accountRequest = `${accountURL}/login`;
	accountResponse = await fetch(accountRequest, {
		method: "POST",
		body: request.body

	}).then((response) => response.json());

	reponse.send(fitnessResponse);

})

/* Put to Change Password */
router.put("/changePassword", async (request, response) => {

	accountRequest = `${accountURL}/changePassword`;
	accountResponse = await fetch(accountRequest, {
		method: "PUT",
		body: request.body

	}).then((response) => response.json());

	reponse.send(fitnessResponse);

})


module.exports = router;
