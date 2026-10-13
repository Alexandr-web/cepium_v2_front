import { describe, it, expect } from "vitest";
import { extractBaseSymbol } from "../../app/utils/index";

describe("extractBaseSymbol", () => {
	it("должна извлекать базовый символ из пары с слэшем", () => {
		expect(extractBaseSymbol("BTC/USDT")).toBe("BTC");
		expect(extractBaseSymbol("ETH/BTC")).toBe("ETH");
		expect(extractBaseSymbol("SOL/USDT")).toBe("SOL");
	});

	it("должна возвращать исходную строку, приведённую к верхнему регистру, если пара не содержит слэш", () => {
		expect(extractBaseSymbol("BTC")).toBe("BTC");
	});

	it("должна приводить символ к верхнему регистру", () => {
		expect(extractBaseSymbol("btc/usdt")).toBe("BTC");
		expect(extractBaseSymbol("Eth/Btc")).toBe("ETH");
	});

	it("должна trim пробелы вокруг базового символа", () => {
		expect(extractBaseSymbol(" BTC /USDT")).toBe("BTC");
		expect(extractBaseSymbol("BTC / USDT")).toBe("BTC");
	});

	it("должна корректно обрабатывать пары с многосимвольными базовыми активами", () => {
		expect(extractBaseSymbol("WIF/USDT")).toBe("WIF");
		expect(extractBaseSymbol("PEPE/BTC")).toBe("PEPE");
	});
});
