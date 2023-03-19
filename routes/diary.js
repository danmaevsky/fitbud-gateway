require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const FITNESS_URL = process.env.FITNESS_URL;
const PROFILE_URL = process.env.PROFILE_URL;

const util = require("../util");
const router = express.Router();
const diaryURL = `${FITNESS_URL}/diary`;
let diaryRequest;
let diaryResponse;

/* Get Diary by */

router.get("/:diaryId", util.AuthTokenMiddleware, async (request, response) => {

    if (request.params.diaryId) {
        diaryRequest = `${diaryURL}/${request.params.diaryId}`;
    }
    else if(request.query.date) {
        diaryRequest = `${diaryURL}/?date=${request.query.date}`;
    }
    else {
        return response.status(400).send({ message: "Bad Request" });
    }

    diaryResponse = await fetch(diaryRequest, {
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

    if (userId !== diaryResponse.userId) {
		console.log(`userId in accessToken (${userId}) does not match userId in response (${diaryResponse.userId})`);
		response.status(401).send({ message: "Not permitted to view diaries that do not belong to you!" });
	}

    response.send(diaryResponse);

})

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
        diaryResponse = await fetch(diaryRequest, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(diaryRequestBody),
		})
        .then((res) => {
            response.status(res.status);
            return res.json();
        })
        .catch((err) => {
            response.status(500).send({ message: err.message });
        });

    }
    else {
        return response.status(400).send({ message: "Bad Request" });
    }

    response.send(diaryResponse)

})

module.exports = router;
