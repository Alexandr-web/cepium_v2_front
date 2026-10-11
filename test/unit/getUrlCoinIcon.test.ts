import { describe, it, expect } from "vitest";
import { getUrlCoinIcon } from "../../app/utils/index";

describe("getUrlCoinIcon", () => {
	it("должна генерировать корректный URL для иконки монеты", () => {
		expect(getUrlCoinIcon("BTC/USDT")).toBe("https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/btc.svg");
		expect(getUrlCoinIcon("ETH/BTC")).toBe("https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/eth.svg");
	});

	it("должна преобразовывать символ в нижний регистр", () => {
		expect(getUrlCoinIcon("BTC/USDT")).toBe(getUrlCoinIcon("btc/usdt"));
	});

	it("должна генерировать URL с uppercase символом, если пара не содержит слэш", () => {
		expect(getUrlCoinIcon("BTC")).toBe("https://cdn.jsdelivr.net/gh/vadimmalykhin/binance-icons/crypto/btc.svg");
	});
});
