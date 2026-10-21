import { describe, it, expect } from "vitest";
import { isNumber } from "../../app/utils/index";

describe("isNumber", () => {
	it("должен возвращать true для конечных чисел", () => {
		expect(isNumber(0)).toBe(true);
		expect(isNumber(1)).toBe(true);
		expect(isNumber(-1)).toBe(true);
		expect(isNumber(3.14)).toBe(true);
		expect(isNumber(-0.0001)).toBe(true);
		expect(isNumber(1e10)).toBe(true);
	});

	it("должен возвращать false для NaN", () => {
		expect(isNumber(NaN)).toBe(false);
	});

	it("должен возвращать false для Infinity", () => {
		expect(isNumber(Infinity)).toBe(false);
		expect(isNumber(-Infinity)).toBe(false);
	});

	it("должен возвращать false для строк", () => {
		expect(isNumber("0")).toBe(false);
		expect(isNumber("123")).toBe(false);
		expect(isNumber("abc")).toBe(false);
		expect(isNumber("")).toBe(false);
		expect(isNumber("  ")).toBe(false);
	});

	it("должен возвращать false для null и undefined", () => {
		expect(isNumber(null)).toBe(false);
		expect(isNumber(undefined)).toBe(false);
	});

	it("должен возвращать false для булевых значений", () => {
		expect(isNumber(true)).toBe(false);
		expect(isNumber(false)).toBe(false);
	});

	it("должен возвращать false для объектов и массивов", () => {
		expect(isNumber({})).toBe(false);
		expect(isNumber([])).toBe(false);
		expect(isNumber({ value: 123 })).toBe(false);
		expect(isNumber([42])).toBe(false);
	});

	it("должен возвращать false для функций", () => {
		expect(isNumber(() => {})).toBe(false);
		expect(isNumber(function() {})).toBe(false);
		expect(isNumber((): number => 0)).toBe(false);
	});

	it("должен возвращать false для символов и bigints", () => {
		expect(isNumber(Symbol("test"))).toBe(false);
		expect(isNumber(BigInt(0))).toBe(false);
	});
});
