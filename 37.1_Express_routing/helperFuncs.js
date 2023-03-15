const ExpressError = require("./expressError");

/** Convert string of comma separated numbers to an array of numbers. */
function reqiureQueryString(request, key) {
	if (!request.query[key]) {
		throw new ExpressError(`Query string '${key}' is required!`, 400);
	}
}

function convertToNum(str) {
	let nums = str.split(",");
	nums = nums.map((num) => {
		if (isNaN(Number(num)) || Number(num) === Infinity || Number(num) === -Infinity) {
			throw new ExpressError(`${num} is not a valid number!`, 400);
		} else {
			return Number(num);
		}
	});
	return nums;
}

/** Returns the mean given an array of numbers */
function getMean(arr) {
	let average = arr.reduce((acc, next) => acc + next) / arr.length;
	return average;
}

function getMedian(arr) {
	arr.sort((a, b) => a - b);

	let mid = Math.floor(arr.length / 2);
	if (arr.length % 2 === 1) {
		return arr[mid];
	} else {
		mid = Math.floor(arr.length / 2);
		return (arr[mid] + arr[mid - 1]) / 2;
	}
}

/** Get mode from an array of numbers and return as a comma separated string. */
function getMode(arr) {
	let frequency = {};
	for (num of arr) {
		if (frequency[num]) frequency[num]++;
		else frequency[num] = 1;
	}

	let count = 0;
	let mode = [];
	for (key in frequency) {
		if (frequency[key] === count) {
			mode.push(Number(key));
		}
		if (frequency[key] > count) {
			count = frequency[key];
			mode = [Number(key)];
		}
	}
	console.log(mode)
	return mode;
}

module.exports = {
	convertToNum,
	getMean,
	getMedian,
	getMode,
	reqiureQueryString,
};
