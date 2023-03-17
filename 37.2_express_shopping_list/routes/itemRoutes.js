const express = require("express");
const ExpressError = require("../expressError");

const router = new express.Router();

router.get("/", (req, res, next) => {
	try {
		return res.json(items);
	} catch (err) {
		return next(err);
	}
});

router.post("/", (req, res, next) => {
	try {
		const newItem = req.body;
		if (!newItem.name || !newItem.price)
			throw new ExpressError("Item must have a name and price", 400);

		if (items.find((item) => item.name === newItem.name))
			throw new ExpressError("Item name already exists!", 400);

		items.push(newItem);

		return res
			.status(201)
			.json({ added: { name: newItem.name, price: newItem.price } });
	} catch (err) {
		return next(err);
	}
});

router.get("/:name", (req, res, next) => {
	try {
		const foundItem = items.find((item) => item.name === req.params.name);
		if (!foundItem) return next();
		return res.json(foundItem);
	} catch (err) {
		return next(err);
	}
});

router.patch("/:name", (req, res, next) => {
	try {
		const foundItem = items.find((item) => item.name === req.params.name);
		if (!foundItem) return next();
		if (req.body.name) foundItem.name = req.body.name;
		if (req.body.price) foundItem.price = req.body.price;

		return res.json({
			updated: { name: foundItem.name, price: foundItem.price },
		});
	} catch (err) {
		return next(err);
	}
});

router.delete("/:name", (req, res, next) => {
	try {
		const foundIdx = items.findIndex((item) => item.name === req.params.name);
		console.log("index = ", foundIdx);
		if (foundIdx === -1) return next();

		items.splice(foundIdx, 1);

		return res.json({ message: "Deleted" });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
