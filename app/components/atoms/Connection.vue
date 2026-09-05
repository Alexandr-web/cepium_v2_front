<template>
	<ClientOnly>
		<div class="flex items-center gap-8 rounded-8 border border-solid border-neutral-200/60 bg-neutral-300/30 px-10 py-6">
			<span
				class="w-6 h-6 rounded-full transition-colors"
				:class="statusBgClasses"
			/>
			<p class="text-10 font-semibold tracking-wider text-neutral-500 uppercase">
				ws: <span v-if="connectionStore.status !== ConnectionStatuses.NONE" class="text-neutral-700">{{ connectionStore.statusText }}</span>
			</p>
		</div>
	</ClientOnly>
</template>

<script setup lang="ts">
import { useConnectionStore } from "@/store/useConnectionStore";

const connectionStore = useConnectionStore();

const statusBgClasses = computed(() => {
	switch (connectionStore.status) {
		case ConnectionStatuses.CONNECTING:
			return "bg-amber-500 animate-pulse";
		case ConnectionStatuses.OPEN:
			return "bg-emerald-500";
		case ConnectionStatuses.CLOSING:
			return "bg-neutral-400";
		case ConnectionStatuses.CLOSED:
			return "bg-rose-500";
		case ConnectionStatuses.NONE:
			return "bg-neutral-500";
		default:
			return "";
	}
});
</script>
