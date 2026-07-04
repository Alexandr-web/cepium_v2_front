import { describe, it, expect, vi } from "vitest";
import { getURLFile } from "../../app/utils/index";

describe("getURLFile", () => {
	it("должна возвращать строку без изменений, если передана строка", () => {
		const input = "https://example.com";
		const result = getURLFile(input);
		expect(result).toBe(input);
	});

	it("должна создавать Blob-URL, если передан объект File", () => {
		const mockBlobUrl = "blob:http://localhost/unique-id";
		const createObjectUrlMock = vi
			.spyOn(URL, "createObjectURL")
			.mockReturnValue(mockBlobUrl);

		const file = new File(["content"], "test.png", { type: "image/png" });

		const result = getURLFile(file);

		expect(result).toBe(mockBlobUrl);
		expect(createObjectUrlMock).toHaveBeenCalledWith(file);

		createObjectUrlMock.mockRestore();
	});

	it("должна возвращать пустую строку для некорректных типов данных", () => {
		expect(getURLFile(null)).toBe("");
		expect(getURLFile(undefined)).toBe("");
		expect(getURLFile(123)).toBe("");
		expect(getURLFile({})).toBe("");
		expect(getURLFile([])).toBe("");
	});
});
