import { describe, it, expect } from "vitest";
import { formatLocalDate } from "../../app/utils/index";

describe("formatLocalDate", () => {
	describe("базовое форматирование", () => {
		it("форматирует строку ISO", () => {
			expect(formatLocalDate("2026-10-22T14:30:00Z")).toBe("22.10.2026");
		});

		it("форматирует объект Date", () => {
			expect(formatLocalDate(new Date("2026-10-22T14:30:00Z"))).toBe("22.10.2026");
		});

		it("форматирует timestamp", () => {
			expect(formatLocalDate(new Date("2026-10-22T14:30:00Z").getTime())).toBe("22.10.2026");
		});
	});

	describe("locale", () => {
		it("по умолчанию использует ru-RU", () => {
			expect(formatLocalDate("2026-10-22T14:30:00Z")).toBe("22.10.2026");
		});

		it("форматирует на шведский (sv-SE)", () => {
			expect(formatLocalDate("2026-10-22T14:30:00Z", "sv-SE")).toBe("2026-10-22");
		});

		it("форматирует на английский (en-US)", () => {
			expect(formatLocalDate("2026-10-22T14:30:00Z", "en-US")).toBe("10/22/2026");
		});

		it("форматирует на немецкий (de-DE)", () => {
			expect(formatLocalDate("2026-10-22T14:30:00Z", "de-DE")).toBe("22.10.2026");
		});
	});

	describe("UTC-поведение", () => {
		it("не сдвигает дату из-за часовых поясов (UTC)", () => {
			// 23:00 UTC — должно остаться 22 октября, а не перейти на 23-й в локальном поясе
			expect(formatLocalDate("2026-10-22T23:00:00Z")).toBe("22.10.2026");
		});

		it("не сдвигает дату в обратную сторону", () => {
			// 01:00 UTC — должно остаться 22 октября
			expect(formatLocalDate("2026-10-22T01:00:00Z")).toBe("22.10.2026");
		});
	});

	describe("крайние случаи", () => {
		it("форматирует 1 января", () => {
			expect(formatLocalDate("2026-01-01T00:00:00Z")).toBe("01.01.2026");
		});

		it("форматирует 31 декабря", () => {
			expect(formatLocalDate("2026-12-31T23:59:59Z")).toBe("31.12.2026");
		});

		it("форматирует дату високосного года", () => {
			expect(formatLocalDate("2024-02-29T12:00:00Z")).toBe("29.02.2024");
		});

		it("обрабатывает дату с миллисекундами", () => {
			expect(formatLocalDate("2026-10-22T14:30:00.999Z")).toBe("22.10.2026");
		});
	});
});
