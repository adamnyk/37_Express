const express = require("express");
const app = express();
const ExpressError = require("./expressError");
const {
	convertToNum,
	getMean,
	getMedian,
	getMode,
	reqiureQueryString,
} = require("./helperFuncs");

/**  Call route with query string 'nums' equal to a comma separated list of numbers to recieve the mean */
app.get("/mean", (req, res, next) => {
	try {
		reqiureQueryString(req, "nums");
		const nums = convertToNum(req.query.nums);
		let average = getMean(nums);

		response = { opeartion: "mean", value: average };

		return res.json({ response });
	} catch (err) {
		return next(err);
	}
});

app.get("/median", (req, res, next) => {
	try {
		reqiureQueryString(req, "nums");
		const nums = convertToNum(req.query.nums);
		let median = getMedian(nums);

		response = { opeartion: "median", value: median };

		return res.json({ response });
	} catch (err) {
		return next(err);
	}
});

app.get("/mode", (req, res, next) => {
	try {
		reqiureQueryString(req, "nums");
		const nums = convertToNum(req.query.nums);
		let mode = getMode(nums);

		response = { opeartion: "mode", value: mode };

		return res.json({ response });
	} catch (err) {
		return next(err);
	}
});

//ERROR HANDLERS//
// 404 handler
app.use(function (req, res, next) {
	const notFoundError = new ExpressError("Not Found", 404);
	return next(notFoundError);
});

app.use(function (err, req, res, next) {
	// the default status is 500 Internal Server Error
	let status = err.status || 500;
	let message = err.message;

	// set the status and alert the user
	return res.status(status).json({
		error: { message, status },
	});
});

app.listen(3000, () => {
	console.log("App on port 3000! http://localhost:3000/");
});
