<template>
	<div class="flex flex-col gap-24">
		<LazyOrganismsProfileForm hydrate-on-visible />
	</div>
</template>
<script setup lang="ts">
import keys from "@/api/keys";
import { useUserStore } from "@/store/useUserStore";
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { getData } from "@/api/profile";

const userStore = useUserStore();

const queryKey = keys.getDataProfile;
const queryFn = getData;
const queryClient = useQueryClient();

const { data } = await useAsyncData("profile-ssr", async () => {
	return queryClient.ensureQueryData({ queryKey, queryFn });
});

useQuery({
	queryKey,
	queryFn,
	initialData: data.value,
	select: (data) => userStore.updateData(data.data),
});
</script>
