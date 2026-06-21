<template>
	<div class="flex items-center gap-8 rounded-12 border-1 border-solid text-primary-800 bg-neutral-100 border-white/5 px-12 py-10">
		<span
			class="w-8 h-8 rounded-full"
			:class="statusBg[connectionStore.status]"
		/>
		<p class="uppercase text-10">wss: {{ connectionStore.statusText }}</p>
	</div>
</template>
<script setup lang="ts">
import { useConnectionStore } from "@/store/useConnectionStore";
import { TConnectionStatuses } from "~/types";

const connectionStore = useConnectionStore();

const statusBg = {
	[TConnectionStatuses.CONNECTING]: "bg-secondary-500",
	[TConnectionStatuses.OPEN]: "bg-primary-800",
	[TConnectionStatuses.CLOSING]: "bg-primary-950",
	[TConnectionStatuses.CLOSED]: "bg-white",
};
</script>
