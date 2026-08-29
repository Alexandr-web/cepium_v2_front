import { describe, it, expect } from "vitest";
import { prettyError } from "../../app/utils/index";

describe("prettyError", () => {
	it("должна возвращать сообщение о сбое TLS для ошибок secure tls connection", () => {
		const input = "Error: before secure tls connection was established at client";
		const output = "Сбой защищенного соединения. Проверьте интернет или отключите VPN и попробуйте снова";
		
		expect(prettyError(input)).toBe(output);
	});

	it("должна обрабатывать ошибку TLS независимо от регистра (флаг /i)", () => {
		const input = "BEFORE SECURE TLS CONNECTION WAS ESTABLISHED";
		const output = "Сбой защищенного соединения. Проверьте интернет или отключите VPN и попробуйте снова";
		
		expect(prettyError(input)).toBe(output);
	});

	it("должна возвращать сообщение о таймауте для ошибок connect timeout error", () => {
		const input = "Network issue: connect timeout error occurred";
		const output = "Время ожидания сети истекло. Перезагрузите страницу";
		
		expect(prettyError(input)).toBe(output);
	});

	it("должна возвращать сообщение о закрытии соединения сервером для ошибок other side closed", () => {
		const input = "Fatal: other side closed the connection";
		const output = "Сервер закрыл подключение. Пожалуйста, убедитесь, что интернет работает стабильно, и попробуйте перезагрузить страницу";
		
		expect(prettyError(input)).toBe(output);
	});

	it("должна возвращать исходный текст ошибки, если совпадений с паттернами нет", () => {
		const unknownError = "Internal Server Error (500)";
		const emptyError = "";

		expect(prettyError(unknownError)).toBe(unknownError);
		expect(prettyError(emptyError)).toBe(emptyError);
	});
});
