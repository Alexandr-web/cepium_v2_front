<template>
	<section class="flex flex-col gap-16 w-full lg:max-w-1200 lg:mx-auto">
		<UploadAvatar v-model="avatar" />
		<Activity :activities="activities" />
		<div class="flex flex-col gap-6 lg:gap-16">
			<Collapse label="Общая информация" prepend-icon="person-edit-outline-rounded">
				<GeneralFieldsForm :avatar="avatar" />
			</Collapse>
			<Collapse label="Безопасность" prepend-icon="lock-outline">
				<SecurityFieldsForm />
			</Collapse>
		</div>
	</section>
</template>
<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
import { useActivities } from "@/composables/api/useStatistics";
import UploadAvatar from "@/components/molecules/profile/UploadAvatar.vue";
import GeneralFieldsForm from "@/components/molecules/profile/GeneralFieldsForm.vue";
import SecurityFieldsForm from "@/components/molecules/profile/SecurityFieldsForm.vue";
import Collapse from "@/components/molecules/common/Collapse.vue";
import Activity from "@/components/organisms/profile/Activity.vue";

const { load: loadActivities } = useActivities();

const userStore = useUserStore();

const avatar = ref<File | string | null>(userStore.avatar);

const activities = ref<StatisticsProfileActivitiesResponse["data"]>([]);

onMounted(async () => {
	try {
		const res = await loadActivities();
		activities.value = res.data;
	} catch (err) {
		console.error(err);
	}
});
</script>
