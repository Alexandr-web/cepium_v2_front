<template>
	<section class="flex flex-col gap-16 w-full lg:max-w-1200 lg:mx-auto">
		<UploadAvatar v-model="(fileField!.value as File|string|null)" />
		<Activity :activities="testActivities" />
		<div v-for="(area, idx) in areas" :key="idx" class="flex flex-col gap-16">
			<Collapse :label="area.title" :prepend-icon="area.icon" is-open>
				<component :is="area.component" v-bind="area.formProps" />
			</Collapse>
		</div>
		<Collapse label="Работа с биржами" prepend-icon="partner-exchange-rounded">
			<ASelect
				v-model="exchangeStore.activeExchange"
				placeholder="Выберите активную биржу"
				label="Активная биржа"
				:items="exchanges"
				:disabled="!exchanges.length"
			/>
		</Collapse>
	</section>
</template>
<script setup lang="ts">
import * as z from "zod";
import { useUserStore } from "@/store/useUserStore";
import { useExchangeStore } from "@/store/useExchangeStore";
import AInput from "@/components/atoms/AInput.vue";
import UploadAvatar from "@/components/molecules/profile/UploadAvatar.vue";
import GeneralFieldsForm from "@/components/molecules/profile/GeneralFieldsForm.vue";
import SecurityFieldsForm from "@/components/molecules/profile/SecurityFieldsForm.vue";
import Collapse from "@/components/molecules/common/Collapse.vue";
import ASelect from "@/components/atoms/ASelect.vue";
import Activity from "@/components/organisms/profile/Activity.vue";

const props = defineProps<{ exchanges: ExchangeDto[]; }>();

const userStore = useUserStore();
const exchangeStore = useExchangeStore();

const generalFields = ref<GeneralFormField[]>([
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

const securityFields = ref<GeneralFormField[]>([
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
			normalizedData: (): UserEditGeneralData => ({
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
			normalizedData: (): UserEditSecurityData => ({
				oldPassword: String(securityFields.value.find((f) => f.name === "oldPassword")?.value ?? ""),
				newPassword: String(securityFields.value.find((f) => f.name === "newPassword")?.value ?? ""),
			}),
		},
	},
]);

const fileField = computed(() => generalFields.value.find(({ name }) => name === "avatar"));
const exchanges = computed<SelectItem[]>(() =>
	props.exchanges
		.filter((item) => item.filled)
		.map((item) => ({ label: item.name, value: item.name }))
);

// моковые данные
const testActivities = [
	{ date: "2026-01-01T00:00:00.000Z", value: 1 },
	{ date: "2026-01-07T00:00:00.000Z", value: 7 },
	{ date: "2026-01-09T00:00:00.000Z", value: 10 },
	{ date: "2026-01-13T00:00:00.000Z", value: 8 },
	{ date: "2026-02-18T00:00:00.000Z", value: 15 },
	{ date: "2026-02-24T00:00:00.000Z", value: 15 },
	{ date: "2026-02-25T00:00:00.000Z", value: 15 },
	{ date: "2026-03-30T00:00:00.000Z", value: 15 },
	{ date: "2026-06-09T00:00:00.000Z", value: 15 },
	{ date: "2026-06-10T00:00:00.000Z", value: 15 },
	{ date: "2026-06-11T00:00:00.000Z", value: 15 },
	{ date: "2026-12-31T00:00:00.000Z", value: 6 },
	{ date: "2026-11-30T00:00:00.000Z", value: 60 },
];
</script>
