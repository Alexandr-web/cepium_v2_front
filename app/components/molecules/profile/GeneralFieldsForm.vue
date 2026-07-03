<template>
	<!-- @vue-generic {TUserEditGeneralData}-->
	<GeneralForm
		:fields="inputFields"
		:normalized-data="normalizedData"
		mode="user"
		@send="save"
	>
		<template #content>
			<AButton class="w-full lg:w-auto rounded-4 p-16 lg:px-24 lg:ml-auto" mode="primary-fill" type="submit">
				Сохранить изменения
			</AButton>
		</template>
	</GeneralForm>
</template>
<script setup lang="ts">
import type { TUserEditGeneralData } from "@/types/api";
import type { TGeneralFormField } from "@/types/components";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import AButton from "@/components/atoms/AButton.vue";

const { fields } = defineProps<{
	fields: TGeneralFormField[];
	normalizedData: (fields: TGeneralFormField[]) => TUserEditGeneralData;
}>();

const inputFields = computed(() => fields.filter(({ name }) => ["email", "name"].includes(name)));

// валидация полей
const validateFields = () => {
	fields.forEach((field) => {
		switch (field.name) {
			case "avatar":
				field.error = !(field.check && typeof field.value !== "string") ? "" : (field.check.safeParse(field.value).error?.message ?? "");
				break;
			default:
				field.error = !field.check ? "" : (field.check.safeParse(field.value).error?.message ?? "");
		}
	});

	return fields.every(({ error }) => !error);
};

const save = (data: TUserEditGeneralData) => {
	if (!validateFields()) return;
	console.log(data);
};
</script>
