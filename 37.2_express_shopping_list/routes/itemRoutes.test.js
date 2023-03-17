process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const ExpressError = require("../expressError");

let items = require("../fakeDb");

beforeAll(() => (items.length = 0));
beforeEach(() => {
	muffin = { name: "muffin", price: 2.99 };
	coffee = { name: "coffee", price: 0.99 };
	items.push(muffin, coffee);
});
afterEach(() => (items.length = 0));

describe("GET /items", () => {
	test("Shows all items", async () => {
		const resp = await request(app).get("/items");
		expect(resp.statusCode).toBe(200);
		expect(resp.body).toEqual([muffin, coffee]);
	});
});

describe("POST /items", () => {
	test("Creates a new item", async () => {
		const bagel = { name: "bagel", price: "0.75" };
		const resp = await request(app).post("/items").send(bagel);
		expect(resp.statusCode).toBe(201);
		expect(resp.body).toEqual({ added: bagel });
		expect(items).toEqual([muffin, coffee, bagel]);
	});

	test("Error: item name already used", async () => {
		const duplicate = { name: "muffin", price: "0.75" };
		const resp = await request(app).post("/items").send(duplicate).expect(400);

		// testing error handling through error object
		const errorObject = resp.body;

		expect(errorObject.error.message).toBe("Item name already exists!");
		expect(errorObject.error.status).toBe(400);

		// testing error handling through response.error
		expect(resp.statusCode).toBe(400);
		expect(resp.error.text).toEqual(
			'{"error":{"message":"Item name already exists!","status":400}}'
		);
	});

	test("Error: missing parameters", async () => {
		const badItem = { price: "0.75" };
		const resp = await request(app).post("/items").send(badItem).expect(400);

		const errorObject = resp.body;
		expect(errorObject.error.message).toBe("Item must have a name and price");
	});
});

describe("GET /items/:name", () => {
	test("Returns item that matches :name", async () => {
		const resp = await request(app).get("/items/muffin").expect(200);
		expect(resp.body).toEqual(muffin);
	});

	test("Error: item not found", async () => {
		const resp = await request(app).get("/items/EATEN").expect(404);
		expect(resp.body.error.message).toEqual(`Not Found`);
	});
});

describe("PATCH /items/:name", () => {
	test("Edit's item name", async () => {
		const newMuff = { name: "newmuff!" };
		const resp = await request(app)
			.patch("/items/muffin")
			.send(newMuff)
			.expect(200);

		expect(resp.body).toEqual({
			updated: { name: newMuff.name, price: muffin.price },
		});
		expect(items[0].name).toEqual(newMuff.name);
	});

	test("Edit's item price", async () => {
		const newMuff = { price: 5 };
		const resp = await request(app)
			.patch("/items/muffin")
			.send(newMuff)
			.expect(200);

		expect(resp.body).toEqual({
			updated: { name: muffin.name, price: muffin.price },
		});
		expect(items[0].price).toEqual(newMuff.price);
	});

	test("Edit's item name and price", async () => {
		const newMuff = { name: "newmuff", price: 5 };
		const resp = await request(app)
			.patch("/items/muffin")
			.send(newMuff)
			.expect(200);

		expect(resp.body).toEqual({
			updated: { name: newMuff.name, price: newMuff.price },
		});
		expect(items[0]).toEqual(newMuff);
	});

	test("Error: item not found", async () => {
		const newMuff = { name: "newmuff", price: 5 };
		const resp = await request(app)
			.patch("/items/BADITEM")
			.send(newMuff)
			.expect(404);

		expect(resp.body.error.message).toEqual("Not Found");
	});
});

describe("DELETE /items/:name", () => {
	test("Deletes item", async () => {
		const resp = await request(app).delete("/items/muffin").expect(200);
		expect(resp.body).toEqual({ message: "Deleted" });
		expect(items).not.toContain(muffin);
	});

	test("Error: item not found", async () => {
		const resp = await request(app).delete("/items/FAKE").expect(404);
		expect(resp.body.error.message).toEqual("Not Found");
	});
});
