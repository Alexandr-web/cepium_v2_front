<template>
	<section class="flex flex-col gap-16">
		<h2 class="flex items-center gap-8 text-14 uppercase text-neutral-600 font-light">
			<Icon name="material-symbols:person-edit-outline-rounded" class="w-20 h-20 text-primary-700" />
			<span>Личная информация</span>
		</h2>
		<!-- @vue-generic {TUserEditData}-->
		<GeneralForm
			:fields="fields"
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
	</section>
</template>
<script setup lang="ts">
import type { TGeneralFormField } from "@/types/components";
import type { TUserEditData } from "@/types/api";
import { useUserStore } from "@/store/useUserStore";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import AInput from "@/components/atoms/AInput.vue";
import AButton from "@/components/atoms/AButton.vue";
import * as z from "zod";

const userStore = useUserStore();

const fields = ref<TGeneralFormField[]>([
	{
		name: "email",
		value: String(userStore.user.email ?? ""),
		error: "",
		check: z.email(),
		placeholder: "Эл. почта",
		label: "Эл. почта",
		component: markRaw(AInput),
	},
	{
		name: "password",
		value: "",
		error: "",
		check: z.string().min(6),
		placeholder: "Пароль",
		label: "Пароль",
		type: "password",
		component: markRaw(AInput),
	},
]);

// нормализация данных для отправки на бек
const normalizedData = (): TUserEditData => ({
	email: fields.value.find((f) => f.name === "email")?.value ?? "",
	password: fields.value.find((f) => f.name === "password")?.value ?? "",
});

// валидация всех полей
const validateFields = () => {
	fields.value.forEach((field) => {
		if (field.check) {
			field.error = field.check.safeParse(field.value).error?.message ?? "";
		}
	});

	return fields.value.every(({ error }) => !error);
};

const save = (data: TUserEditData) => {
	if (!validateFields()) return;
	console.log(data);
};
</script>
