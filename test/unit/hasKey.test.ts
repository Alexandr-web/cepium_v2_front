import { describe, it, expect } from "vitest";
import { hasKey } from "../../app/utils/index";

describe("hasKey", () => {
	it("должна возвращать true, если ключ существует в объекте", () => {
		const obj = { foo: "bar", baz: 42 };

		expect(hasKey(obj, "foo")).toBe(true);
		expect(hasKey(obj, "baz")).toBe(true);
	});

	it("должна возвращать false, если ключ отсутствует в объекте и в прототипе", () => {
		const obj = { foo: "bar", baz: 42 };

		expect(hasKey(obj, "missing")).toBe(false);
		expect(hasKey(obj, "other")).toBe(false);
	});

	it("должна возвращать false для пустого объекта", () => {
		const obj = {};

		expect(hasKey(obj, "any")).toBe(false);
	});

	it("должна возвращать true для ключа, находящегося в прототипе (operator `in` проверяет цепочку прототипов)", () => {
		const obj = Object.create({ inherited: "value" });

		expect(hasKey(obj, "inherited")).toBe(true);
	});

	it("должна корректно работать со строковыми ключами", () => {
		const obj = { name: "test", count: 10 };

		expect(hasKey(obj, "name")).toBe(true);
		expect(hasKey(obj, "count")).toBe(true);
		expect(hasKey(obj, "id")).toBe(false);
	});

	it("должна корректно работать с числовыми ключами", () => {
		const obj = { 0: "zero", 1: "one" };

		expect(hasKey(obj, 0)).toBe(true);
		expect(hasKey(obj, 1)).toBe(true);
		expect(hasKey(obj, 2)).toBe(false);
	});

	it("должна выбросить TypeError для null и undefined", () => {
		expect(() => hasKey(null as unknown as object, "key")).toThrow(TypeError);
		expect(() => hasKey(undefined as unknown as object, "key")).toThrow(TypeError);
	});

	it("должна корректно работать с символическими ключами", () => {
		const sym = Symbol("test");
		const obj = { [sym]: "sym-value" };

		expect(hasKey(obj, sym)).toBe(true);
		expect(hasKey(obj, "toString")).toBe(true);
	});

	it("должна корректно работать с пустой строкой как с ключом", () => {
		const obj = { "": "empty-key", foo: "bar" };

		expect(hasKey(obj, "")).toBe(true);
		expect(hasKey(obj, "foo")).toBe(true);
	});
});
