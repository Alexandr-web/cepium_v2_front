import { describe, it, expect } from "vitest";
import { getFiltersQuery } from "../../app/utils/index";

describe("getFiltersQuery", () => {
	it("возвращает пустой объект для пустого массива", () => {
		expect(getFiltersQuery([])).toEqual({});
	});

	it("преобразует один фильтр в объект", () => {
		const filters = [
			{ name: "status", value: "active" } as const,
		];
		expect(getFiltersQuery(filters)).toEqual({ status: "active" });
	});

	it("преобразует несколько фильтров", () => {
		const filters = [
			{ name: "status", value: "active" },
			{ name: "days", value: "30" },
			{ name: "exchange", value: "bybit" },
		];
		expect(getFiltersQuery(filters)).toEqual({
			status: "active",
			days: "30",
			exchange: "bybit",
		});
	});

	it("приводит строковые значения к строке", () => {
		const filters = [
			{ name: "flag", value: "true" },
			{ name: "count", value: "42" },
		];
		expect(getFiltersQuery(filters)).toEqual({
			flag: "true",
			count: "42",
		});
	});

	it("приводит массивы к строке", () => {
		const filters = [
			{ name: "tags", value: ["a", "b"] },
		];
		expect(getFiltersQuery(filters)).toEqual({ tags: "a,b" });
	});

	it("приводит булевы значения к строке", () => {
		const filters = [
			{ name: "enabled", value: true },
			{ name: "disabled", value: false },
		];
		expect(getFiltersQuery(filters)).toEqual({
			enabled: "true",
			disabled: "false",
		});
	});

	it("перезаписывает значение при дублирующихся именах", () => {
		const filters = [
			{ name: "status", value: "old" },
			{ name: "status", value: "new" },
		];
		expect(getFiltersQuery(filters)).toEqual({ status: "new" });
	});

	it("сохраняет порядок ключей по порядку в массиве", () => {
		const filters = [
			{ name: "z", value: "1" },
			{ name: "a", value: "2" },
			{ name: "m", value: "3" },
		];
		const result = getFiltersQuery(filters);
		expect(Object.keys(result)).toEqual(["z", "a", "m"]);
	});
});
