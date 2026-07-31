import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatIsoToPrettyStr } from "../../app/utils/index";

describe("formatIsoToPrettyStr", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		process.env.TZ = "Europe/Moscow"; 
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("должна корректно форматировать валидную ISO строку с учетом GMT+3", () => {
		const input = "2026-07-28T16:15:22Z";
		const output = "28-07-2026 19:15:22";
		
		expect(formatIsoToPrettyStr(input)).toBe(output);
	});

	it("должна корректно добавлять ведущие нули для однозначных чисел (месяц, день, часы, минуты, секунды)", () => {
		const input = "2026-01-01T01:01:01Z";
		const output = "01-01-2026 04:01:01";
		
		expect(formatIsoToPrettyStr(input)).toBe(output);
	});

	it("должна возвращать пустую строку, если передана некорректная строка даты", () => {
		expect(formatIsoToPrettyStr("not-a-date")).toBe("");
		expect(formatIsoToPrettyStr("")).toBe("");
		expect(formatIsoToPrettyStr("2026-13-45T25:00:00Z")).toBe("");
	});

	it("должна корректно обрабатывать даты на стыке суток из-за смещения часового пояса", () => {
		const input = "2026-07-28T23:00:00Z";
		const output = "29-07-2026 02:00:00";
		
		expect(formatIsoToPrettyStr(input)).toBe(output);
	});
});
