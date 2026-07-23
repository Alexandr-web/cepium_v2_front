<template>
	<section class="flex flex-col gap-16 w-full lg:max-w-1200 lg:mx-auto">
		<UploadAvatar v-model="fileField!.value as File|string|null" />
		<div v-for="(area, idx) in areas" :key="idx" class="flex flex-col gap-16">
			<Collapse :label="area.title" :preppend-icon="area.icon" is-open>
				<component :is="area.component" v-bind="area.formProps" />
			</Collapse>
		</div>
	</section>
</template>
<script setup lang="ts">
import * as z from "zod";
import { useUserStore } from "@/store/useUserStore";
import AInput from "@/components/atoms/AInput.vue";
import UploadAvatar from "@/components/molecules/profile/UploadAvatar.vue";
import GeneralFieldsForm from "@/components/molecules/profile/GeneralFieldsForm.vue";
import SecurityFieldsForm from "@/components/molecules/profile/SecurityFieldsForm.vue";
import Collapse from "@/components/molecules/common/Collapse.vue";

const userStore = useUserStore();

const generalFields = ref<TGeneralFormField[]>([
	{
		name: "avatar",
		value: userStore.avatar,
		check: z.file().max(MAX_SIZE_FILE_AVATAR),
		error: "",
	},
	{
		name: "email",
		value: userStore.user?.email ?? "",
		error: "",
		check: z.email().min(1),
		placeholder: "Эл. почта",
		label: "Эл. почта",
		component: markRaw(AInput),
	},
	{
		name: "name",
		value: userStore.user?.name ?? "",
		error: "",
		check: z.string().min(1),
		placeholder: "Имя",
		label: "Имя",
		component: markRaw(AInput),
	},
]);

const securityFields = ref<TGeneralFormField[]>([
	{
		name: "oldPassword",
		value: "",
		error: "",
		check: z.string().min(6),
		placeholder: "Пароль",
		label: "Старый пароль",
		type: "password",
		component: markRaw(AInput),
	},
	{
		name: "newPassword",
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
		icon: "person-edit-outline-rounded",
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
		icon: "lock-outline",
		component: markRaw(SecurityFieldsForm),
		formProps: {
			fields: securityFields.value,
			// нормализация данных для отправки на бек
			normalizedData: (): TUserEditSecurityData => ({
				oldPassword: String(securityFields.value.find((f) => f.name === "oldPassword")?.value ?? ""),
				newPassword: String(securityFields.value.find((f) => f.name === "newPassword")?.value ?? ""),
			}),
		},
	},
]);

const fileField = computed(() => generalFields.value.find(({ name }) => name === "avatar"));
</script>
