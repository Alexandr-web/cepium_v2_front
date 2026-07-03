<template>
	<section class="flex flex-col gap-16 w-full lg:max-w-1200 lg:mx-auto">
		<UploadAvatar v-model="fileField!.value" />
		<div v-for="(area, idx) in areas" :key="idx" class="flex flex-col gap-16">
			<h3 class="flex items-center gap-8 text-14 uppercase text-neutral-600 font-light">
				<Icon :name="area.icon" class="w-20 h-20 text-primary-700" />
				<span>{{ area.title }}</span>
			</h3>
			<component :is="area.component" v-bind="area.formProps" />
		</div>
	</section>
</template>
<script setup lang="ts">
import type { TGeneralFormField } from "@/types/components";
import { useUserStore } from "@/store/useUserStore";
import type { TUserEditGeneralData, TUserEditSecurityData } from "@/types/api";
import AInput from "@/components/atoms/AInput.vue";
import UploadAvatar from "@/components/molecules/profile/UploadAvatar.vue";
import GeneralFieldsForm from "@/components/molecules/profile/GeneralFieldsForm.vue";
import SecurityFieldsForm from "@/components/molecules/profile/SecurityFieldsForm.vue";
import * as z from "zod";

const userStore = useUserStore();

const generalFields = ref<TGeneralFormField[]>([
	{
		name: "avatar",
		value: String(userStore.avatar),
		check: z.file().max(MAX_SIZE_FILE_AVATAR),
		error: "",
	},
	{
		name: "email",
		value: String(userStore.user.email ?? ""),
		error: "",
		check: z.email().min(1),
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

const securityFields = ref<TGeneralFormField[]>([
	{
		name: "password",
		value: "",
		error: "",
		check: z.string().min(6),
		placeholder: "Пароль",
		label: "Новый пароль",
		type: "password",
		component: markRaw(AInput),
	},
]);

const areas = ref([
	{
		title: "Общая информация",
		icon: "material-symbols:person-edit-outline-rounded",
		component: markRaw(GeneralFieldsForm),
		formProps: {
			fields: generalFields.value,
			// нормализация данных для отправки на бек
			normalizedData: (): TUserEditGeneralData => ({
				avatar: !(fileField.value?.value instanceof File) ? undefined : fileField.value?.value,
				email: String(generalFields.value.find((f) => f.name === "email")?.value ?? ""),
				name: String(generalFields.value.find((f) => f.name === "name")?.value ?? ""),
			}),
		},
	},
	{
		title: "Безопасность",
		icon: "material-symbols:lock-outline",
		component: markRaw(SecurityFieldsForm),
		formProps: {
			fields: securityFields.value,
			// нормализация данных для отправки на бек
			normalizedData: (): TUserEditSecurityData => ({
				password: String(securityFields.value.find((f) => f.name === "password")?.value ?? ""),
			}),
		},
	},
]);

const fileField = computed(() => generalFields.value.find(({ name }) => name === "avatar"));
</script>
