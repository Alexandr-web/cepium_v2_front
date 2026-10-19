import { describe, it, expect } from "vitest";
import { parseExchangeErrorMessage } from "../../app/utils/index";

describe("parseExchangeErrorMessage", () => {
	it("должна возвращать пустую строку, если rawData не является строкой", () => {
		expect(parseExchangeErrorMessage(null)).toBe("");
		expect(parseExchangeErrorMessage(123)).toBe("");
		expect(parseExchangeErrorMessage({})).toBe("");
	});

	it("должна успешно парсить JSON, удалять префикс биржи и вызывать форматирование для parsed.message", () => {
		const rawData = "bybit {\"message\": \"connect timeout error\", \"retCode\": 0}";
		const expected = "Время ожидания сети истекло. Перезагрузите страницу";
		
		expect(parseExchangeErrorMessage(rawData)).toBe(expected);
	});

	it("должна использовать parsed.retMsg, если parsed.message отсутствует", () => {
		const rawData = "bybit {\"retMsg\": \"other side closed\"}";
		const expected = "Сервер закрыл подключение. Пожалуйста, убедитесь, что интернет работает стабильно, и попробуйте перезагрузить страницу";
		
		expect(parseExchangeErrorMessage(rawData)).toBe(expected);
	});

	it("должна игнорировать регистр префикса биржи при его удалении", () => {
		const rawData = "BYBIT {\"message\": \"connect timeout error\"}";
		const expected = "Время ожидания сети истекло. Перезагрузите страницу";
		
		expect(parseExchangeErrorMessage(rawData)).toBe(expected);
	});

	it("не должна игнорировать retCode 10002, если название биржи отличается от bybit", () => {
		const rawData = "binance {\"message\": \"connect timeout error\", \"retCode\": 10002}";
		const expected = "Время ожидания сети истекло. Перезагрузите страницу";
		
		expect(parseExchangeErrorMessage(rawData, "binance")).toBe(expected);
	});

	it("должна возвращать исходную строку rawData в блоке catch, если строка не является валидным JSON", () => {
		const rawData = "bybit status code 502 Bad Gateway";
		
		expect(parseExchangeErrorMessage(rawData)).toBe(rawData);
	});

	it("должна использовать rawData в качестве fallback, если в валидном JSON нет полей message или retMsg", () => {
		const rawData = "bybit {\"unknownField\": \"value\"}";
		
		// Так как полей нет, prettyError получает весь rawData целиком и возвращает его без изменений
		expect(parseExchangeErrorMessage(rawData)).toBe(rawData);
	});
});
