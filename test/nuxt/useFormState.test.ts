import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import * as z from "zod";
import { useFormState } from "@/composables/useFormState";

describe("useFormState", () => {
	it("валидирует все поля, а не только первое", () => {
		const { fields, validate } = useFormState({
			email: { value: "", error: "", check: z.email() },
			password: { value: "", error: "", check: z.string().min(6) },
		});

		expect(validate()).toBe(false);
		expect(fields.email.error).toBeTruthy();
		expect(fields.password.error).toBeTruthy();
	});

	it("возвращает читаемое сообщение об ошибке, а не JSON", () => {
		const { fields, validate } = useFormState({
			email: { value: "invalid", error: "", check: z.email() },
		});

		validate();

		expect(fields.email.error).toBeTruthy();
		expect(fields.email.error.startsWith("[")).toBe(false);
	});

	it("валидирует поле сразу при изменении модели", async () => {
		const { fields } = useFormState({
			email: { value: "", error: "", check: z.email() },
		});

		fields.email.value = "invalid";
		await nextTick();

		expect(fields.email.error).toBeTruthy();
	});

	it("не показывает ошибку для пустого поля", async () => {
		const { fields } = useFormState({
			email: { value: "invalid", error: "", check: z.email() },
		});

		fields.email.value = "";
		await nextTick();

		expect(fields.email.error).toBe("");
	});

	it("reset возвращает значения и ошибки к начальным", () => {
		const { fields, reset } = useFormState({
			email: { value: "a@b.com", error: "", check: z.email() },
			name: { value: "John", error: "", check: z.string().min(1) },
		});

		fields.email.value = "invalid";
		fields.name.error = "ошибка";
		reset();

		expect(fields.email.value).toBe("a@b.com");
		expect(fields.email.error).toBe("");
		expect(fields.name.value).toBe("John");
		expect(fields.name.error).toBe("");
	});
});
