import { describe, it, expect } from "vitest";
import { formatNum } from "../../app/utils/index";

const replaceSpaces = (s: string) => s.replace(/\s/g, " ");

describe("formatNum", () => {
	describe("без опций (стиль decimal по умолчанию)", () => {
		it("форматирует целое положительное число", () => {
			expect(replaceSpaces(formatNum(1234))).toBe("1 234");
		});

		it("форматирует целое отрицательное число", () => {
			expect(replaceSpaces(formatNum(-1234))).toBe("-1 234");
		});

		it("форматирует дробное положительное число", () => {
			expect(replaceSpaces(formatNum(1234.56))).toBe("1 234,56");
		});

		it("округляет дробную часть до двух знаков", () => {
			expect(replaceSpaces(formatNum(1234.567))).toBe("1 234,57");
		});

		it("убирает незначащие нули в дробной части", () => {
			expect(replaceSpaces(formatNum(1234.5))).toBe("1 234,5");
		});

		it("форматирует ноль", () => {
			expect(replaceSpaces(formatNum(0))).toBe("0");
		});

		it("форматирует отрицательную дробь", () => {
			expect(replaceSpaces(formatNum(-1234.56))).toBe("-1 234,56");
		});

		it("форматирует маленькое положительное число", () => {
			expect(replaceSpaces(formatNum(0.5))).toBe("0,5");
		});

		it("форматирует очень маленькое положительное число", () => {
			expect(replaceSpaces(formatNum(0.05))).toBe("0,05");
		});

		it("форматирует отрицательное маленькое число", () => {
			expect(replaceSpaces(formatNum(-0.5))).toBe("-0,5");
		});
	});

	describe("с опцией padZero: true", () => {
		it("добавляет ведущий ноль для чисел с одной цифрой в целой части (>=1)", () => {
			expect(replaceSpaces(formatNum(9, { padZero: true }))).toBe("09");
		});

		it("не добавляет ведущий ноль для чисел с двумя и более цифрами", () => {
			expect(replaceSpaces(formatNum(10, { padZero: true }))).toBe("10");
			expect(replaceSpaces(formatNum(99, { padZero: true }))).toBe("99");
		});

		it("не влияет на числа с целой частью 0 (|num| < 1)", () => {
			expect(replaceSpaces(formatNum(0.5, { padZero: true }))).toBe("0,5");
			expect(replaceSpaces(formatNum(0.05, { padZero: true }))).toBe("0,05");
		});

		it("работает с отрицательными числами (|num| >= 1)", () => {
			expect(replaceSpaces(formatNum(-9, { padZero: true }))).toBe("-09");
			expect(replaceSpaces(formatNum(-10, { padZero: true }))).toBe("-10");
		});

		it("не влияет на ноль (|0| < 1)", () => {
			expect(replaceSpaces(formatNum(0, { padZero: true }))).toBe("0");
		});
	});

	describe("стиль currency", () => {
		it("форматирует целое число в USD", () => {
			expect(replaceSpaces(formatNum(1500, { style: "currency", currency: "USD" }))).toBe("1 500 $");
		});

		it("форматирует дробное число в USD", () => {
			expect(replaceSpaces(formatNum(1.5, { style: "currency", currency: "USD" }))).toBe("1,5 $");
		});

		it("форматирует маленькое число в USD", () => {
			expect(replaceSpaces(formatNum(0.05, { style: "currency", currency: "USD" }))).toBe("0,05 $");
		});

		it("форматирует отрицательное число в USD", () => {
			expect(replaceSpaces(formatNum(-1500, { style: "currency", currency: "USD" }))).toBe("-1 500 $");
		});

		it("форматирует в EUR", () => {
			expect(replaceSpaces(formatNum(1000, { style: "currency", currency: "EUR" }))).toBe("1 000 €");
		});

		it("форматирует в RUB", () => {
			expect(replaceSpaces(formatNum(1000, { style: "currency", currency: "RUB" }))).toBe("1 000 ₽");
		});

		it("корректно комбинируется с padZero: true", () => {
			expect(replaceSpaces(formatNum(9, { style: "currency", currency: "USD", padZero: true }))).toBe("09 $");
			expect(replaceSpaces(formatNum(10, { style: "currency", currency: "USD", padZero: true }))).toBe("10 $");
			expect(replaceSpaces(formatNum(0.5, { style: "currency", currency: "USD", padZero: true }))).toBe("0,5 $");
		});
	});

	describe("стиль percent", () => {
		it("форматирует 0.5 как 50 %", () => {
			expect(replaceSpaces(formatNum(0.5, { style: "percent" }))).toBe("50 %");
		});

		it("форматирует 1 как 100 %", () => {
			expect(replaceSpaces(formatNum(1, { style: "percent" }))).toBe("100 %");
		});

		it("форматирует 0.05 как 5 %", () => {
			expect(replaceSpaces(formatNum(0.05, { style: "percent" }))).toBe("5 %");
		});

		it("форматирует отрицательное значение", () => {
			expect(replaceSpaces(formatNum(-0.5, { style: "percent" }))).toBe("-50 %");
		});

		it("корректно комбинируется с padZero: true (для чисел с целой частью)", () => {
			expect(replaceSpaces(formatNum(0.5, { style: "percent", padZero: true }))).toBe("50 %");
			expect(replaceSpaces(formatNum(9, { style: "percent", padZero: true }))).toBe("900 %");
		});
	});

	describe("комбинации стилей и padZero с разными значениями", () => {
		it("decimal + padZero для числа с одной цифрой", () => {
			expect(replaceSpaces(formatNum(5, { padZero: true }))).toBe("05");
		});
		it("currency + padZero для числа с одной цифрой", () => {
			expect(replaceSpaces(formatNum(5, { style: "currency", currency: "USD", padZero: true }))).toBe("05 $");
		});
		it("percent + padZero для числа с одной цифрой в целой части после умножения на 100", () => {
			expect(replaceSpaces(formatNum(0.05, { style: "percent", padZero: true }))).toBe("5 %");
		});
	});

	describe("обработка строковых значений", () => {
		it("преобразует строку с целым числом", () => {
			expect(replaceSpaces(formatNum("1234"))).toBe("1 234");
		});

		it("преобразует строку с дробным числом (точка)", () => {
			expect(replaceSpaces(formatNum("1234.56"))).toBe("1 234,56");
		});

		it("преобразует строку с ведущими нулями", () => {
			expect(replaceSpaces(formatNum("00123"))).toBe("123");
		});

		it("возвращает defaultValue для нечисловой строки", () => {
			expect(replaceSpaces(formatNum("abc"))).toBe("0");
			expect(replaceSpaces(formatNum(""))).toBe("0");
		});

		it("возвращает кастомный defaultValue для нечисловой строки", () => {
			expect(replaceSpaces(formatNum("abc", { defaultValue: "—" }))).toBe("—");
			expect(replaceSpaces(formatNum("", { defaultValue: "пусто" }))).toBe("пусто");
		});

		it("частично разбирает строку, начинающуюся с числа", () => {
			expect(replaceSpaces(formatNum("123abc"))).toBe("123");
			expect(replaceSpaces(formatNum("123.45abc"))).toBe("123,45");
		});

		it("строка с запятой как разделителем даёт NaN (parseFloat не поддерживает запятую)", () => {
			expect(replaceSpaces(formatNum("123,45"))).toBe("0");
		});
	});

	describe("крайние случаи и граничные значения", () => {
		it("очень большое число", () => {
			expect(replaceSpaces(formatNum(1234567890))).toBe("1 234 567 890");
		});

		it("очень маленькое положительное число (округляется до 0)", () => {
			expect(replaceSpaces(formatNum(0.0001))).toBe("0");
			expect(replaceSpaces(formatNum(0.004))).toBe("0");
			expect(replaceSpaces(formatNum(0.005))).toBe("0,01");
		});

		it("очень маленькое отрицательное число", () => {
			expect(replaceSpaces(formatNum(-0.0001))).toBe("0");
			expect(replaceSpaces(formatNum(-0.005))).toBe("0");
		});

		it("значение NaN возвращает defaultValue", () => {
			expect(replaceSpaces(formatNum(NaN))).toBe("0");
			expect(replaceSpaces(formatNum(NaN, { defaultValue: "ошибка" }))).toBe("ошибка");
		});

		it("значение Infinity форматируется", () => {
			expect(replaceSpaces(formatNum(Infinity))).toBe("0");
			expect(replaceSpaces(formatNum(-Infinity))).toBe("0");
		});

		it("отрицательный ноль", () => {
			expect(replaceSpaces(formatNum(-0))).toBe("0");
		});
	});
});
