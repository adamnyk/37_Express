const express = require("express");
const app = express();
const ExpressError = require("./expressError");
const itemRoutes = require("./routes/itemRoutes");

// items array will be reset each time server restarts
const items = require("./fakeDb");

app.use(express.json());

app.use("/items", itemRoutes);

// 404 handler
app.use(function (req, res, next) {
	const notFoundError = new ExpressError("Not Found", 404);
	return next(notFoundError);
});

// Generic error handler
app.use(function (err, req, res, next) {
	let status = err.status || 500;
	let message = err.message;

	// set the status and alert the user
	return res.status(status).json({
		error: { message, status },
	});
});

module.exports = app;
