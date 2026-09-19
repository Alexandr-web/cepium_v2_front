<template>
	<div class="flex flex-col gap-24">
		<OrganismsProfileForm :exchanges="exchanges" />
		<OrganismsProfileExchanges :exchanges="exchanges" />
	</div>
</template>
<script setup lang="ts">
import { useUser } from "@/composables/api/useUser";
import { useExchanges } from "@/composables/api/useExchanges";

const { data: exchangesData, suspense: suspenseExchanges } = useExchanges();
const { suspense: suspenseUser } = useUser();

await Promise.all([suspenseUser(), suspenseExchanges()]);

const exchanges = computed(() => exchangesData.value?.data ?? []);
</script>
