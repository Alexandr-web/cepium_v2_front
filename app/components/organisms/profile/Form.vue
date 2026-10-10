<template>
	<section class="flex flex-col gap-16 w-full lg:max-w-1200 lg:mx-auto">
		<UploadAvatar v-model="avatar" />
		<Activity :activities="testActivities" />
		<Collapse label="Общая информация" prepend-icon="person-edit-outline-rounded" is-open>
			<GeneralFieldsForm :avatar="avatar" />
		</Collapse>
		<Collapse label="Безопасность" prepend-icon="lock-outline" is-open>
			<SecurityFieldsForm />
		</Collapse>
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
import { useUserStore } from "@/store/useUserStore";
import { useExchangeStore } from "@/store/useExchangeStore";
import UploadAvatar from "@/components/molecules/profile/UploadAvatar.vue";
import GeneralFieldsForm from "@/components/molecules/profile/GeneralFieldsForm.vue";
import SecurityFieldsForm from "@/components/molecules/profile/SecurityFieldsForm.vue";
import Collapse from "@/components/molecules/common/Collapse.vue";
import ASelect from "@/components/atoms/ASelect.vue";
import Activity from "@/components/organisms/profile/Activity.vue";

const props = defineProps<{ exchanges: ExchangeDto[]; }>();

const userStore = useUserStore();
const exchangeStore = useExchangeStore();

const avatar = ref<File | string | null>(userStore.avatar);

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
