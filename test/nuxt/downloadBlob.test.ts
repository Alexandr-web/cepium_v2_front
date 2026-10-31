import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { downloadBlob } from "../../app/utils/index";

describe("downloadBlob", () => {
	let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
	let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
	let createElementSpy: ReturnType<typeof vi.spyOn>;
	let appendChildSpy: ReturnType<typeof vi.spyOn>;
	let bodyAppendChildSpy: ReturnType<typeof vi.spyOn>;
	let bodyRemoveChildSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		document.body.innerHTML = "";

		createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:faked-url");
		revokeObjectURLSpy = vi.spyOn(URL, "revokeObjectURL");
		createElementSpy = vi.spyOn(document, "createElement");
		appendChildSpy = vi.spyOn(Document.prototype, "appendChild");
		bodyAppendChildSpy = vi.spyOn(document.body, "appendChild");
		bodyRemoveChildSpy = vi.spyOn(document.body, "removeChild");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("создание и настройка элемента", () => {
		it("создаёт anchor-элемент типа 'a'", () => {
			downloadBlob(new Blob(["test"]), "test.txt");

			expect(createElementSpy).toHaveBeenCalledWith("a");
		});

		it("добавляет anchor в body", () => {
			downloadBlob(new Blob(["test"]), "test.txt");

			expect(bodyAppendChildSpy).toHaveBeenCalled();
		});

		it("вызывает click на anchor", () => {
			const mockAnchor = document.createElement("a");
			const clickSpy = vi.spyOn(mockAnchor, "click");

			appendChildSpy.mockImplementation((node: Node) => {
				if (node === mockAnchor) {
					clickSpy.mockRestore();
					vi.spyOn(mockAnchor, "click").mockImplementation(() => {
						// no-op
					});
				}

				return document.body.appendChild(node);
			});

			downloadBlob(new Blob(["test"]), "test.txt");
		});

		it("удаляет anchor из body после клика", () => {
			downloadBlob(new Blob(["test"]), "test.txt");

			expect(bodyRemoveChildSpy).toHaveBeenCalled();
		});
	});

	describe("очистка", () => {
		it("вызывает URL.revokeObjectURL для освобождения памяти", () => {
			downloadBlob(new Blob(["data"]), "file.txt");

			expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:faked-url");
		});

		it("вызывает createObjectURL один раз", () => {
			downloadBlob(new Blob(["data"]), "file.txt");

			expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
		});

		it("вызывает revokeObjectURL один раз", () => {
			downloadBlob(new Blob(["data"]), "file.txt");

			expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe("разные типы файлов", () => {
		it("скачивает Excel-файл", () => {
			downloadBlob(new Blob(["excel"]), "report.xlsx");

			expect(createObjectURLSpy).toHaveBeenCalled();
			expect(revokeObjectURLSpy).toHaveBeenCalled();
		});

		it("скачивает CSV-файл", () => {
			downloadBlob(new Blob(["csv,data"]), "data.csv");

			expect(createObjectURLSpy).toHaveBeenCalled();
			expect(revokeObjectURLSpy).toHaveBeenCalled();
		});

		it("скачивает текстовый файл", () => {
			downloadBlob(new Blob(["hello"]), "notes.txt");

			expect(createObjectURLSpy).toHaveBeenCalled();
			expect(revokeObjectURLSpy).toHaveBeenCalled();
		});

		it("скачивает JSON-файл", () => {
			downloadBlob(new Blob(["{\"key\":\"value\"}"]), "config.json");

			expect(createObjectURLSpy).toHaveBeenCalled();
			expect(revokeObjectURLSpy).toHaveBeenCalled();
		});
	});

	describe("специальные имена файлов", () => {
		it("обрабатывает имя с несколькими точками", () => {
			downloadBlob(new Blob(["data"]), "report.v2.0_final.xlsx");

			expect(createObjectURLSpy).toHaveBeenCalled();
		});

		it("обрабатывает имя с пробелами", () => {
			downloadBlob(new Blob(["data"]), "my report file.xlsx");

			expect(createObjectURLSpy).toHaveBeenCalled();
		});

		it("обрабатывает имя с кириллицей", () => {
			downloadBlob(new Blob(["data"]), "отчёт_2024.xlsx");

			expect(createObjectURLSpy).toHaveBeenCalled();
		});

		it("обрабатывает имя с underscores и дефисами", () => {
			downloadBlob(new Blob(["data"]), "report-2024_final_data.xlsx");

			expect(createObjectURLSpy).toHaveBeenCalled();
		});
	});

	describe("Blob-данные", () => {
		it("корректно обрабатывает пустой Blob", () => {
			downloadBlob(new Blob([]), "empty.txt");

			expect(createObjectURLSpy).toHaveBeenCalled();
			expect(revokeObjectURLSpy).toHaveBeenCalled();
		});

		it("корректно обрабатывает большой Blob", () => {
			const largeData = "x".repeat(10_000_000);

			downloadBlob(new Blob([largeData]), "large.txt");

			expect(createObjectURLSpy).toHaveBeenCalled();
			expect(revokeObjectURLSpy).toHaveBeenCalled();
		});

		it("корректно обрабатывает Blob с бинарными данными", () => {
			const buffer = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer;

			downloadBlob(new Blob([buffer]), "image.png");

			expect(createObjectURLSpy).toHaveBeenCalled();
			expect(revokeObjectURLSpy).toHaveBeenCalled();
		});
	});

	describe("URL API", () => {
		it("передаёт Blob в URL.createObjectURL", () => {
			const blob = new Blob(["data"]);

			downloadBlob(blob, "file.txt");

			expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
		});

		it("передаёт сгенерированный URL в revokeObjectURL", () => {
			downloadBlob(new Blob(["data"]), "file.txt");

			expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:faked-url");
		});

		it("передаёт тот же URL, который вернул createObjectURL", () => {
			const fakeUrl = "blob:test-unique-id";
			createObjectURLSpy.mockReturnValue(fakeUrl);

			downloadBlob(new Blob(["data"]), "file.txt");

			expect(revokeObjectURLSpy).toHaveBeenCalledWith(fakeUrl);
		});
	});
});
