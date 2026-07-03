<template>
	<!-- @vue-generic {TUserEditData}-->
	<GeneralForm
		:fields="inputFields"
		:normalized-data="normalizedData"
		mode="user"
		@send="save"
	>
		<template #content>
			<AButton class="flex items-center justify-center gap-10 w-full lg:w-auto rounded-4 p-16 lg:px-24 transition hover:bg-primary-950 bg-primary-800 text-primary-200 text-14 font-bold lg:ml-auto" type="submit">
				<span>Сохранить изменения</span>
				<Icon name="material-symbols:save-outline" class="w-20 h-20 text-primary-300" />
			</AButton>
		</template>
	</GeneralForm>
</template>
<script setup lang="ts">
import type { TUserEditData } from "@/types/api";
import type { TGeneralFormField } from "@/types/components";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import AButton from "@/components/atoms/AButton.vue";

const { fields } = defineProps<{
	fields: TGeneralFormField[];
	normalizedData: (fields: TGeneralFormField[]) => TUserEditData;
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

const save = (data: TUserEditData) => {
	if (!validateFields()) return;
	console.log(data);
};
</script>
