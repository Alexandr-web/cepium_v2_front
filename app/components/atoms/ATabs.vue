<template>
	<div class="border border-white/5 bg-neutral-100 rounded-4 scroll-block overflow-auto max-w-full">
		<ul class="flex items-center w-max overflow-hidden h-full min-h-0">
			<li
				v-for="item in items"
				:key="item.value"
				class="py-10 lg:py-12 px-22 lg:px-26 flex items-center justify-center text-14 not-last:border-r not-last:border-r-white/5 transition h-full min-h-0"
				:class="[
					activeValue === item.value && 'text-primary-600 font-medium bg-primary-300/20',
					activeValue !== item.value && 'text-white/80 font-light hover:text-white hover:bg-primary-300/10',
					!disabled && 'cursor-pointer',
					disabled && 'select-none'
				]"
				@click="!disabled && emits('select', item.value)"
			>
				{{ item.label }}
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
withDefaults(
	defineProps<{
		items: SelectItem[];
		activeValue: string;
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

const emits = defineEmits(["select"]);
</script>
