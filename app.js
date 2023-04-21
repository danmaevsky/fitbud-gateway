require("dotenv").config();
const validator = require("express-validator");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
	// Make sure that Content-Type header is provided and is application/json for anything that is not a GET or DELETE
	if ((req.method !== "GET" || req.method !== "DELETE") && req.headers["content-type"] !== "application/json") {
		let e = new SyntaxError();
		e.status = 400;
		throw e;
	}
	next();
});
app.use((err, req, res, next) => {
	// handling JSON error
	if (err instanceof SyntaxError && err.status === 400) {
		console.log("Caught error in Gateway:", err.message);
		return res.status(400).send({ message: "Atrotious request." });
	}
	next();
});
app.use(
	cors({
		origin: "*",
	})
);
app.use((req, res, next) => {
	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
	console.log("Got Request!");
	req.method ? console.log("Method:", req.method) : null;
	req.originalUrl ? console.log("Original URL:", req.originalUrl) : null;
	req.get("Authorization") ? console.log("Authorization:", req.get("Authorization")) : null;
	next();
});
const GATEWAY_PORT = process.env.GATEWAY_PORT;

// Routes
const foodRoute = require("./routes/food");
const recipesRoute = require("./routes/recipes");
const cardioRoute = require("./routes/cardio");
const strengthRoute = require("./routes/strength");
const workoutsRoute = require("./routes/workouts");
const accountRoute = require("./routes/account");
const profileRoute = require("./routes/profile");
const diaryRoute = require("./routes/diary");

// Use Routes
app.use("/food", foodRoute);
app.use("/recipes", recipesRoute);
app.use("/exercise/cardio", cardioRoute);
app.use("/exercise/strength", strengthRoute);
app.use("/workouts", workoutsRoute);
app.use("/account", accountRoute);
app.use("/profile", profileRoute);
app.use("/diary", diaryRoute);

// Start Listening
app.listen(GATEWAY_PORT, () => console.log("Gateway Server Started...listening on Port", GATEWAY_PORT)); // http://localhost:8000
