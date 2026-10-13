import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { isCurrentDate } from "../../app/utils/index";

describe("isCurrentDate", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("должна возвращать true, если дата совпадает с текущей", () => {
		const now = new Date();
		vi.setSystemTime(now);

		expect(isCurrentDate(now.toISOString())).toBe(true);
	});

	it("должна возвращать false, если дата отличается от текущей", () => {
		vi.setSystemTime(new Date("2026-01-01T12:00:00Z"));

		expect(isCurrentDate("2026-02-01T00:00:00Z")).toBe(false);
		expect(isCurrentDate("2025-06-15T12:00:00Z")).toBe(false);
		expect(isCurrentDate("2027-12-31T23:59:59Z")).toBe(false);
	});

	it("должна возвращать false, если год отличается", () => {
		vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));

		expect(isCurrentDate("2025-06-15T12:00:00Z")).toBe(false);
		expect(isCurrentDate("2027-06-15T12:00:00Z")).toBe(false);
	});

	it("должна возвращать false, если месяц отличается", () => {
		vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));

		expect(isCurrentDate("2026-05-15T12:00:00Z")).toBe(false);
		expect(isCurrentDate("2026-07-15T12:00:00Z")).toBe(false);
	});

	it("должна возвращать false, если день отличается", () => {
		vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));

		expect(isCurrentDate("2026-06-14T12:00:00Z")).toBe(false);
		expect(isCurrentDate("2026-06-16T12:00:00Z")).toBe(false);
	});

	it("должна возвращать true, если время внутри одного дня, но разное по часам", () => {
		vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));

		expect(isCurrentDate("2026-06-15T14:30:45Z")).toBe(true);
		expect(isCurrentDate("2026-06-15T18:00:00Z")).toBe(true);
	});

	it("должна возвращать false для невалидной даты", () => {
		vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));

		expect(isCurrentDate("invalid-date")).toBe(false);
		expect(isCurrentDate("not-a-date")).toBe(false);
	});
});
