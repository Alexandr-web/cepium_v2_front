import { describe, it, expect } from "vitest";
import { isNegativeZero } from "../../app/utils/index";

describe("isNegativeZero", () => {
	it("должен возвращать true для -0", () => {
		expect(isNegativeZero(-0)).toBe(true);
	});

	it("должен возвращать false для 0", () => {
		expect(isNegativeZero(0)).toBe(false);
	});

	it("должен возвращать false для положительных чисел", () => {
		expect(isNegativeZero(1)).toBe(false);
		expect(isNegativeZero(3.14)).toBe(false);
		expect(isNegativeZero(0.0001)).toBe(false);
		expect(isNegativeZero(Infinity)).toBe(false);
	});

	it("должен возвращать false для отрицательных чисел, отличных от -0", () => {
		expect(isNegativeZero(-1)).toBe(false);
		expect(isNegativeZero(-3.14)).toBe(false);
		expect(isNegativeZero(-0.0001)).toBe(false);
		expect(isNegativeZero(-Infinity)).toBe(false);
	});

	it("должен возвращать false для строк", () => {
		expect(isNegativeZero("-0")).toBe(false);
		expect(isNegativeZero("0")).toBe(false);
		expect(isNegativeZero("123")).toBe(false);
		expect(isNegativeZero("abc")).toBe(false);
		expect(isNegativeZero("")).toBe(false);
	});

	it("должен возвращать false для null и undefined", () => {
		expect(isNegativeZero(null)).toBe(false);
		expect(isNegativeZero(undefined)).toBe(false);
	});

	it("должен возвращать false для NaN", () => {
		expect(isNegativeZero(NaN)).toBe(false);
	});

	it("должен возвращать false для булевых значений", () => {
		expect(isNegativeZero(true)).toBe(false);
		expect(isNegativeZero(false)).toBe(false);
	});

	it("должен возвращать false для объектов и массивов", () => {
		expect(isNegativeZero({})).toBe(false);
		expect(isNegativeZero([])).toBe(false);
		expect(isNegativeZero({ value: -0 })).toBe(false);
	});

	it("должен возвращать false для функции", () => {
		expect(isNegativeZero(() => {})).toBe(false);
	});
});
