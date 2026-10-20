import { describe, it, expect } from "vitest";
import { formatNumberSign } from "../../app/utils/index";

describe("formatNumberSign", () => {
	describe("без параметра output (используется val)", () => {
		it("добавляет плюс к положительному числу", () => {
			expect(formatNumberSign(1234)).toBe("+1234");
		});

		it("не добавляет плюс к отрицательному числу", () => {
			expect(formatNumberSign(-1234)).toBe("-1234");
		});

		it("не добавляет плюс к нулю", () => {
			expect(formatNumberSign(0)).toBe("0");
		});

		it("корректно обрабатывает числа в виде строк", () => {
			expect(formatNumberSign("5")).toBe("+5");
			expect(formatNumberSign("-5")).toBe("-5");
		});
	});

	describe("с параметром output", () => {
		it("добавляет плюс к кастомному выводу, если val положительный", () => {
			expect(formatNumberSign(15, "15%")).toBe("+15%");
			expect(formatNumberSign(100, "$100")).toBe("+$100");
		});

		it("не добавляет плюс к кастомному выводу, если val отрицательный или ноль", () => {
			expect(formatNumberSign(-15, "15%")).toBe("15%");
			expect(formatNumberSign(0, "0%")).toBe("0%");
		});
	});

	describe("крайние случаи и строки-нечисла", () => {
		it("не добавляет плюс, если val не является валидным числом", () => {
			expect(formatNumberSign("abc")).toBe("abc");
		});

		it("использует output, даже если val невалидное число", () => {
			expect(formatNumberSign("abc", "error")).toBe("error");
		});
	});
});
