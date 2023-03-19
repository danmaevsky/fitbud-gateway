require("dotenv").config();
const express = require("express");
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
        
    }
    else if(request.query.date) {

    }

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

        diaryRequest = `${diaryURL}/${request.query.date}`;
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
