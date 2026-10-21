import { describe, it, expect } from "vitest";
import { getAvatarUrl } from "../../app/utils/index";

describe("getAvatarUrl", () => {
	it("подставляет имя файла бэкенда к базе API", () => {
		expect(getAvatarUrl("/api", "avatar-default.jpg")).toBe("/api/users/me/avatars/avatar-default.jpg");
	});

	it("возвращает blob-URL без изменений", () => {
		const blobUrl = "blob:http://localhost/unique-id";
		expect(getAvatarUrl("/api", blobUrl)).toBe(blobUrl);
	});

	it("возвращает абсолютный URL без изменений", () => {
		const absoluteUrl = "https://cdn.example.com/avatar.png";
		expect(getAvatarUrl("/api", absoluteUrl)).toBe(absoluteUrl);
	});

	it("возвращает пустую строку, если имени файла нет", () => {
		expect(getAvatarUrl("/api", null)).toBe("");
		expect(getAvatarUrl("/api", undefined)).toBe("");
		expect(getAvatarUrl("/api", "")).toBe("");
	});

	it("возвращает пустую строку, если база API не задана", () => {
		expect(getAvatarUrl(undefined, "avatar-default.jpg")).toBe("");
	});
});
