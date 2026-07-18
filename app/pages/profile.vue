<template>
	<div class="flex flex-col gap-24">
		<OrganismsProfileForm />
		<OrganismsProfileExchanges />
	</div>
</template>
<script setup lang="ts">
import { useUser } from "@/composables/api/useUser";

const { suspense } = useUser();

await suspense();
</script>
