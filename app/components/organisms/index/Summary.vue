<template>
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
		<div
			v-for="(item, idx) in summary"
			:key="idx"
			class="flex flex-col justify-between gap-32 rounded-8 bg-neutral-100/80 border-solid border-1 border-white/5 p-16"
		>
			<div class="flex items-center justify-between">
				<h3 class="text-12 lg:text-16 uppercase">{{ item.title }}</h3>
				<Icon v-if="item.icon" :name="item.icon" class="w-22 lg:w-26 h-18 lg:h-22 text-primary-800" />
			</div>
			<div class="flex flex-col gap-8">
				<span
					class="text-18 font-semibold"
					:class="[
						item.type === 'balance' && 'lg:text-48',
						item.type !== 'balance' && 'lg:text-36',
						item.type === 'pnl' && 'text-tertiary-800',
						item.type !== 'pnl' && 'text-white'
					]"
				>{{ item.value }}</span>
				<slot name="note" v-bind="item" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { TIndexCardSummary } from "@/types/components";

defineProps<{
	summary: TIndexCardSummary[];
}>();
</script>
