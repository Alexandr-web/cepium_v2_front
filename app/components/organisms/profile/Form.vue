<template>
	<section class="flex flex-col gap-16 w-full lg:max-w-1200 lg:mx-auto">
		<UploadAvatar v-model="fileField!.value" />
		<div class="flex flex-col gap-16">
			<h3 class="flex items-center gap-8 text-14 uppercase text-neutral-600 font-light">
				<Icon name="material-symbols:person-edit-outline-rounded" class="w-20 h-20 text-primary-700" />
				<span>Общая информация</span>
			</h3>
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
		</div>
	</section>
</template>
<script setup lang="ts">
import type { TGeneralFormField } from "@/types/components";
import type { TUserEditData } from "@/types/api";
import { useUserStore } from "@/store/useUserStore";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import AInput from "@/components/atoms/AInput.vue";
import AButton from "@/components/atoms/AButton.vue";
import UploadAvatar from "@/components/molecules/profile/UploadAvatar.vue";
import * as z from "zod";

const userStore = useUserStore();

const fields = ref<TGeneralFormField[]>([
	{
		name: "avatar",
		value: String(userStore.avatar),
		error: "",
	},
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
		name: "name",
		value: String(userStore.user.name ?? ""),
		error: "",
		check: z.string().min(1),
		placeholder: "Имя",
		label: "Имя",
		component: markRaw(AInput),
	},
]);

const fileField = computed(() => fields.value.find(({ name }) => name === "avatar"));
const inputFields = computed(() => fields.value.filter(({ name }) => ["email", "name"].includes(name)));

// нормализация данных для отправки на бек
const normalizedData = (): TUserEditData => ({
	avatar: !(fileField.value?.value instanceof File) ? undefined : fileField.value?.value,
	email: String(fields.value.find((f) => f.name === "email")?.value ?? ""),
	name: String(fields.value.find((f) => f.name === "name")?.value ?? ""),
});

// валидация полей
const validateFields = () => {
	inputFields.value.forEach((field) => {
		if (field.check && field.value) {
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
