<template>
	<div class="flex flex-col gap-24 grow">
		<LazyOrganismsConfigsList :configs="configs" :is-pending="isPending" />
	</div>
</template>
<script setup lang="ts">
import { useConfigs } from "@/composables/api/useConfigs";

const { data, suspense, isPending } = useConfigs();

await suspense();

const configs = computed(() => data.value?.data ?? []);
</script>
