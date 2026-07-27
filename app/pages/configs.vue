<template>
	<div class="flex flex-col gap-24 grow">
		<OrganismsConfigsList :configs="configs" />
	</div>
</template>
<script setup lang="ts">
import { useConfigs } from "@/composables/api/useConfigs";

const { data, suspense } = useConfigs();

await suspense();

const configs = computed(() => data.value?.data ?? []);
</script>
