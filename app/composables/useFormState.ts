import type z from "zod";

const isEmpty = (value: unknown): boolean =>
	value === "" || value === null || value === undefined ||
	(Array.isArray(value) && value.length === 0);

export type FormField<T = unknown> = {
	value: T;
	error: string;
	check?: z.ZodType;
};

/**
 * Создаёт реактивное состояние формы. `initFields` — поля с начальным значением,
 * ошибкой и схемой Zod. `fields` — реактивный `{ value, error }`, доступный
 * снаружи (для `v-model`) и внутри; `reset()` возвращает значения к начальным.
 */
export const useFormState = <T extends Record<string, FormField>>(initFields: T) => {
	const fields = reactive(initFields);

	const getMessage = (key: string): string => {
		const check = initFields[key]?.check;
		if (!check) return "";
		const parsed = check.safeParse(fields[key]?.value);
		return parsed.success ? "" : (parsed.error.issues[0]?.message ?? "Некорректное значение");
	};

	const validateField = (key: string): boolean => {
		const field = fields[key];
		if (!field) return false;

		field.error = getMessage(key);
		return !field.error;
	};

	const validate = (keys?: string[]): boolean => {
		let valid = true;
		(keys ?? Object.keys(fields)).forEach((key) => {
			if (!validateField(key)) valid = false;
		});
		return valid;
	};

	const isFieldValid = (key: string): boolean => !getMessage(key);

	const reset = () => {
		Object.keys(fields).forEach((key) => {
			const field = fields[key];
			if (!field) return;
			field.value = initFields[key]?.value;
			field.error = "";
		});
	};

	// Живая валидация сразу при изменении модели: пустое поле ошибку не показывает.
	const values = computed(() => Object.keys(fields).map((key) => fields[key]?.value));

	watch(values, () => {
		Object.keys(fields).forEach((key) => {
			const field = fields[key];
			if (!field) return;
			field.error = isEmpty(field.value) ? "" : getMessage(key);
		});
	});

	return { fields, validate, isFieldValid, reset };
};
