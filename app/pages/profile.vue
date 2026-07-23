<template>
	<div class="flex flex-col gap-24">
		<LazyOrganismsProfileForm hydrate-on-visible />
		<LazyOrganismsProfileExchanges hydrate-on-visible />
	</div>
</template>
<script setup lang="ts">
import { useUser } from "@/composables/api/useUser";
import { useExchanges } from "@/composables/api/useExchanges";

const { suspense: suspenseExchanges } = useExchanges();
const { suspense: suspenseUser } = useUser();

await Promise.all([suspenseUser(), suspenseExchanges()]);
</script>
