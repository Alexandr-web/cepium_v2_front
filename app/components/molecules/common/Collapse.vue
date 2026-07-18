<template>
	<div class="flex flex-col rounded-8 border-1 border-solid border-neutral-400 bg-primary-200">
		<div class="flex items-center justify-between gap-10 cursor-pointer p-12" @click="isActive = !isActive">
			<div class="flex items-center gap-10">
				<Icon v-if="preppendIcon" :name="preppendIcon" class="w-20 h-20 text-primary-600" />
				<h3 class="text-16 lg:text-18 text-neutral-800 select-none">{{ label }}</h3>
			</div>
			<Icon
				name="material-symbols:keyboard-arrow-down-rounded"
				class="w-24 h-24 text-neutral-800"
				:class="[isActive && 'rotate-x-180']"
			/>
		</div>
		<div v-show="isActive" class="p-12 pt-0">
			<slot />
		</div>
	</div>
</template>
<script setup lang="ts">
const { isOpen = false, preppendIcon = "" } = defineProps<{
	isOpen?: boolean;
	label: string;
	preppendIcon?: string;
}>();

const isActive = ref(isOpen);
</script>
