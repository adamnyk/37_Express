const ExpressError = require("./expressError");
const {
	convertToNum,
	getMean,
	getMedian,
	getMode,
	reqiureQueryString,
} = require("./helperFuncs");

describe("requieQueryString function", () => {
	test("should throw error if query parameter is null.", () => {
		let request = { query: { nums: null } };
		expect(() => reqiureQueryString(request, "nums")).toThrow(
			new ExpressError(`Query string 'nums' is required!`)
		);
	});
	test("should throw error if query parameter is undefined.", () => {
		let request = { query: { name: "adam" } };
		expect(() => reqiureQueryString(request, "nums")).toThrow(
			new ExpressError(`Query string 'nums' is required!`)
		);
	});
	test("should not throw error if query parameter is present.", () => {
		let request = { query: { nums: "1,4,2" } };
		expect(() => reqiureQueryString(request, "nums")).not.toThrow(
			new ExpressError(`Query string 'nums' is required!`)
		);
	});
});

describe("converToNum function", () => {
	test("should convert comma separated string to an array of numbers", () => {
		string = "-2,1,0,77,3";
		nums = convertToNum(string);
		expect(nums).toEqual(expect.any(Array));
		expect(nums).toEqual([-2, 1, 0, 77, 3]);
	});

	test("should throw error for invalid number", () => {
		string = "-2,1,0,77,apple";
		function convert() {
			convertToNum(string);
		}

		expect(convert).toThrow(ExpressError);
		expect(convert).toThrow(new ExpressError("apple is not a valid number!"));

		// Testing Status Code. Is there a better way?
		let thrownError;
		try {
			convert();
		} catch (err) {
			thrownError = err;
		}
		expect(thrownError.status).toEqual(400);
	});

	test("should throw error for Infinity or -Infinity values", () => {
		expect(() => convertToNum("Infinity")).toThrow(ExpressError);
		expect(() => convertToNum("-Infinity")).toThrow(ExpressError);
	});
});

describe("getMean function", () => {
	test("should calulate mean for an array of positive numbers", () => {
		nums = [2, 5, 10, 7];
		expect(getMean(nums)).toEqual(6);
	});
	test("should calulate mean for an array of negative", () => {
		nums = [-1, -10, -5];
		expect(getMean(nums)).toEqual(-5.333333333333333);
	});
	test("should calulate mean for an array of numbers including zero", () => {
		nums = [1, 0, 10, -5];
		expect(getMean(nums)).toEqual(1.5);
	});
	test("should calulate mean for an array of one number", () => {
		nums = [4];
		expect(getMean(nums)).toEqual(4);
	});
});

describe("getMedian function", () => {
	test("should calulate median for an array of numbers with an odd length", () => {
		nums = [-2, 0, 5, 6, 7];
		expect(getMedian(nums)).toEqual(5);
	});
	test("should calulate median for an array of numbers with an even length", () => {
		nums = [-2, 0, 2, 7];
		expect(getMedian(nums)).toEqual(1);
	});
});

describe("getMode function", () => {
	test("should calulate mode for an array of numbers", () => {
		nums = [-2, 0, 5, 6, 7, 0, 7, 7];
		expect(getMode(nums)).toEqual([7]);
	});
	test("should be able to return multiple modes", () => {
		nums = [-2, 0, 2, 7, 0, 2, 7, 0, 2, -2];
		expect(getMode(nums)).toEqual([0, 2]);
	});
});
