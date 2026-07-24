export const useForm = (_fields: MaybeRefOrGetter<TGeneralFormField[]>) => {
	const fields = computed(() => toValue(_fields));
	const hasInvalidFields = computed(() => fields.value.some(({ error }) => error));

	const validateFields = () => {
		fields.value.forEach((field) => {
			switch (field.name) {
				case "avatar":
					field.error = !(field.check && typeof field.value !== "string") ? "" : (field.check.safeParse(field.value).error?.message ?? "");
					break;
				default:
					field.error = !field.check ? "" : (field.check.safeParse(field.value).error?.message ?? "");
			}
		});

		return fields.value.every(({ error }) => !error);
	};

	return { fields, hasInvalidFields, validateFields };
};
