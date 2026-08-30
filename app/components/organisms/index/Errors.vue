<template>
	<section v-if="connectionStore.errorMessage" class="flex flex-col bg-secondary-400/20 border border-secondary-400 p-16 rounded-6 lg:rounded-12">
		<div class="flex items-center gap-6">
			<IconError class="text-secondary-600 w-24 h-24" />
			<p class="text-secondary-600 text-14 lg:text-16">{{ connectionStore.errorMessage }}</p>
		</div>
	</section>
</template>
<script setup lang="ts">
import IconError from "@/assets/icons/fluent-error-circle.svg";
import { useConnectionStore } from "@/store/useConnectionStore";

const connectionStore = useConnectionStore();
</script>
