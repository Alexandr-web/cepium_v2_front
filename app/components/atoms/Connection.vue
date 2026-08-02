<template>
	<div class="flex items-center gap-8 rounded-8 border border-solid border-neutral-200/60 bg-neutral-300/30 px-10 py-6">
		<ClientOnly>
			<span
				class="w-6 h-6 rounded-full transition-colors"
				:class="[
					statusBg[connectionStore.status],
					connectionStore.status === ConnectionStatuses.CONNECTING && 'animate-pulse'
				]"
			/>
			
			<p class="text-10 font-semibold tracking-wider text-neutral-500 uppercase">
				ws: <span v-if="connectionStore.status !== ConnectionStatuses.NONE" class="text-neutral-700">{{ connectionStore.statusText }}</span>
			</p>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import { useConnectionStore } from "@/store/useConnectionStore";

const connectionStore = useConnectionStore();

const statusBg = {
	[ConnectionStatuses.CONNECTING]: "bg-amber-500",
	[ConnectionStatuses.OPEN]: "bg-emerald-500",
	[ConnectionStatuses.CLOSING]: "bg-neutral-400",
	[ConnectionStatuses.CLOSED]: "bg-rose-500",
	[ConnectionStatuses.NONE]: "bg-neutral-500",
};
</script>
