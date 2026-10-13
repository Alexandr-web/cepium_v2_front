import { describe, it, expect } from "vitest";
import type { FetchError } from "ofetch";
import { getRequestErrorMessage } from "../../app/utils/index";

describe("getRequestErrorMessage", () => {
	it("должна возвращать строку message, если data.message — строка", () => {
		const err: FetchError = { data: { message: "Неверный пароль" } };

		expect(getRequestErrorMessage(err)).toBe("Неверный пароль");
	});

	it("должна возвращать первый элемент массива, если data.message — массив строк", () => {
		const err: FetchError = { data: { message: ["Email обязателен", "Пароль слишком короткий"] } };

		expect(getRequestErrorMessage(err)).toBe("Email обязателен");
	});

	it("должна вернуть null, если data.message равен null", () => {
		const err: FetchError = { data: { message: null } };

		expect(getRequestErrorMessage(err)).toBeNull();
	});

	it("должна вернуть undefined, если data.message равен undefined", () => {
		const err: FetchError = { data: { message: undefined } };

		expect(getRequestErrorMessage(err)).toBeUndefined();
	});

	it("должна вернуть пустую строку, если data.message — пустой массив", () => {
		const err: FetchError = { data: { message: [] } };

		expect(getRequestErrorMessage(err)).toBe("");
	});

	it("должна вернуть пустую строку, если data.message — массив с пустым первым элементом", () => {
		const err: FetchError = { data: { message: [""] } };

		expect(getRequestErrorMessage(err)).toBe("");
	});

	it("должна выбросить TypeError, если data отсутствует", () => {
		const err = {} satisfies FetchError;

		expect(() => getRequestErrorMessage(err)).toThrow(TypeError);
	});
});
