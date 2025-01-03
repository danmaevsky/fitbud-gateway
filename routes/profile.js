require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const util = require("../util");
const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs-extra");
const upload = multer({ storage: storage });
const PROFILE_URL = process.env.PROFILE_URL;

const router = express.Router();
let profileRequest;
let profileResponse;
let profileStatus;

/* Get Profile by UserID */
router.get("/users", util.AuthTokenMiddleware, async (request, response) => {
    let token = request.get("Authorization").split(" ")[1];
    let userId = jwt.decode(token).userId;
    profileRequest = `${PROFILE_URL}/users/${userId}`;
    try {
        profileResponse = await fetch(profileRequest, {
            method: "GET",
        }).then((res) => {
            console.log("Profile Response Status:", res.status);
            response.status(res.status);
            profileStatus = res.status;
            return res.json();
        });
    } catch (err) {
        console.log("Caught Error in Gateway:", err.message);
        return response.status(500).send({ message: err.message });
    }
    console.log("Response from Profile API:", profileResponse);
    console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
    response.status(profileStatus).send(profileResponse);
});

/* Patch Profile by UserId */
router.patch("/users", util.AuthTokenMiddleware, async (request, response) => {
    let token = request.get("Authorization").split(" ")[1];
    let userId = jwt.decode(token).userId;
    profileRequest = `${PROFILE_URL}/users/${userId}`;
    try {
        profileResponse = await fetch(profileRequest, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request.body),
        }).then((res) => {
            console.log("Profile Response Status:", res.status);
            response.status(res.status);
            profileStatus = res.status;
            return res.json();
        });
    } catch (err) {
        console.log("Caught Error in Gateway:", err.message);
        return response.status(500).send({ message: err.message });
    }
    console.log("Response from Profile API:", profileResponse);
    console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
    response.status(profileStatus).send(profileResponse);
});

/* GET a profile picture */
router.get("/users/profilePicture", util.AuthTokenMiddleware, async (request, response) => {
    let token = request.get("Authorization").split(" ")[1];
    let userId = jwt.decode(token).userId;

    profileRequest = `${PROFILE_URL}/profilePicture/${userId}`;

    try {
        profileResponse = await fetch(profileRequest, {
            method: "GET",
        }).then((res) => {
            console.log("Profile Response Status:", res.status);
            response.status(res.status);
            profileStatus = res.status;
            return res.json();
        });
    } catch (err) {
        console.log("Caught Error in Gateway:", err.message);
        return response.status(500).send({ message: err.message });
    }

    console.log("Response from Profile API:", profileResponse);
    console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);

    response.status(profileStatus).send(profileResponse);
});

router.post("/users/profilePicture", util.AuthTokenMiddleware, upload.single("image"), async (request, response) => {
    let token = request.get("Authorization").split(" ")[1];
    let userId = jwt.decode(token).userId;

    const formData = new FormData();

    try {
        console.log(request.file.path);
        formData.append("image", fs.createReadStream(request.file.path));
    } catch (err) {
        console.log("goofy ah error ", err.message);
    }

    profileRequest = `${PROFILE_URL}/profilePicture/${userId}`;

    console.log(request.file);
    console.log(typeof request.file);

    try {
        profileResponse = await fetch(profileRequest, {
            method: "POST",
            body: formData,
        }).then((res) => {
            console.log("Profile Response Status:", res.status);
            response.status(res.status);
            profileStatus = res.status;
            return res.json();
        });
    } catch (err) {
        console.log("Caught Error in Gateway:", err.message);
        return response.status(500).send({ message: err.message });
    }

    console.log("Response from Profile API:", profileResponse);
    console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);

    response.status(profileStatus).send(profileResponse);
});

/* GET search history */
router.get("/users/history", util.AuthTokenMiddleware, async (request, response) => {
    let token = request.get("Authorization").split(" ")[1];
    let userId = jwt.decode(token).userId;
    profileRequest = `${PROFILE_URL}/history/${userId}`;
    try {
        profileResponse = await fetch(profileRequest, {
            method: "GET",
        }).then((res) => {
            console.log("Profile Response Status:", res.status);
            response.status(res.status);
            profileStatus = res.status;
            return res.json();
        });
    } catch (err) {
        console.log("Caught Error in Gateway:", err.message);
        return response.status(500).send({ message: err.message });
    }
    console.log("Response from Profile API:", profileResponse);
    console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
    response.status(profileStatus).send(profileResponse);
});

/* DELETE search history */
router.delete("/users/history", util.AuthTokenMiddleware, async (request, response) => {
    let token = request.get("Authorization").split(" ")[1];
    let userId = jwt.decode(token).userId;
    profileRequest = `${PROFILE_URL}/history/${userId}`;
    try {
        profileResponse = await fetch(profileRequest, {
            method: "DELETE",
        }).then((res) => {
            console.log("Profile Response Status:", res.status);
            response.status(res.status);
            profileStatus = res.status;
            return res.json();
        });
    } catch (err) {
        console.log("Caught Error in Gateway:", err.message);
        return response.status(500).send({ message: err.message });
    }
    console.log("Response from Profile API:", profileResponse);
    console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
    response.status(profileStatus).send(profileResponse);
});

/* GET user progress */
router.get("/users/progress", util.AuthTokenMiddleware, async (request, response) => {
    let token = request.get("Authorization").split(" ")[1];
    let userId = jwt.decode(token).userId;
    let queryDate = request.query.queryDate;
    profileRequest = `${PROFILE_URL}/progress/?userId=${userId}`;
    if (queryDate) {
        profileRequest = profileRequest + `&queryDate=${queryDate}`;
    }

    try {
        profileResponse = await fetch(profileRequest, {
            method: "GET",
        }).then((res) => {
            console.log("Profile Response Status:", res.status);
            response.status(res.status);
            profileStatus = res.status;
            return res.json();
        });
    } catch (err) {
        console.log("Caught Error in Gateway:", err.message);
        return response.status(500).send({ message: err.message });
    }
    console.log("Response from Profile API:", profileResponse);
    console.log("Message from Profile:", profileResponse ? profileResponse.message : profileResponse);
    response.status(profileStatus).send(profileResponse);
});

module.exports = router;
