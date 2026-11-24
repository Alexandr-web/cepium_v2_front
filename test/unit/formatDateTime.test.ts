import { describe, it, expect } from "vitest";
import { formatDateTime } from "../../app/utils/index";

describe("formatDateTime", () => {
	describe("базовое форматирование", () => {
		it("форматирует строку ISO", () => {
			expect(formatDateTime("2026-10-22T14:30:45")).toBe("22.10.2026, 14:30:45");
		});

		it("форматирует объект Date", () => {
			expect(formatDateTime(new Date("2026-10-22T14:30:45"))).toBe("22.10.2026, 14:30:45");
		});

		it("форматирует timestamp в миллисекундах (число)", () => {
			const ms = new Date("2026-10-22T14:30:45").getTime();
			expect(formatDateTime(ms)).toBe("22.10.2026, 14:30:45");
		});

		it("форматирует timestamp в миллисекундах (строка)", () => {
			const ms = String(new Date("2026-10-22T14:30:45").getTime());
			expect(formatDateTime(ms)).toBe("22.10.2026, 14:30:45");
		});

		it("форматирует timestamp в секундах (число)", () => {
			const sec = Math.floor(new Date("2026-10-22T14:30:45").getTime() / 1000);
			expect(formatDateTime(sec)).toBe("22.10.2026, 14:30:45");
		});

		it("форматирует timestamp в секундах (строка)", () => {
			const sec = String(Math.floor(new Date("2026-10-22T14:30:45").getTime() / 1000));
			expect(formatDateTime(sec)).toBe("22.10.2026, 14:30:45");
		});
	});

	describe("опции (options)", () => {
		it("учитывает переданный часовой пояс (timeZone)", () => {
			expect(formatDateTime("2026-10-22T14:30:45Z", { timeZone: "UTC" })).toBe("22.10.2026, 14:30:45");
			expect(formatDateTime("2026-10-22T14:30:45Z", { timeZone: "Europe/Moscow" })).toBe("22.10.2026, 17:30:45");
		});

		it("возвращает кастомный defaultValue при невалидном значении", () => {
			expect(formatDateTime(null, { defaultValue: "—" })).toBe("—");
			expect(formatDateTime("invalid-date", { defaultValue: "Н/Д" })).toBe("Н/Д");
		});
	});

	describe("крайние случаи и невалидные значения", () => {
		it("форматирует начало года (1 января, 00:00:00)", () => {
			expect(formatDateTime("2026-01-01T00:00:00")).toBe("01.01.2026, 00:00:00");
		});

		it("форматирует конец года (31 декабря, 23:59:59)", () => {
			expect(formatDateTime("2026-12-31T23:59:59")).toBe("31.12.2026, 23:59:59");
		});

		it("форматирует дату високосного года", () => {
			expect(formatDateTime("2024-02-29T09:05:03")).toBe("29.02.2024, 09:05:03");
		});

		it("отбрасывает миллисекунды при форматировании", () => {
			expect(formatDateTime("2026-10-22T14:30:45.999")).toBe("22.10.2026, 14:30:45");
		});

		it("возвращает '-' по умолчанию для null, undefined и пустой строки", () => {
			expect(formatDateTime(null)).toBe("-");
			expect(formatDateTime(undefined)).toBe("-");
			expect(formatDateTime("")).toBe("-");
		});

		it("возвращает '-' для NaN, Infinity и невалидных строк", () => {
			expect(formatDateTime(NaN)).toBe("-");
			expect(formatDateTime(Infinity)).toBe("-");
			expect(formatDateTime("not-a-date")).toBe("-");
		});
	});
});
