<template>
	<div
		class="flex flex-col"
		:class="[
			preset === 'mob' && 'gap-20',
			preset === 'desk' && 'gap-5',
		]"
	>
		<AButton
			class="w-full text-14 rounded-8"
			:class="[
				preset === 'desk' && 'py-8 px-24',
				preset === 'mob' && 'p-14'
			]"
			:disabled="disabled"
			mode="primary-border"
			@click="emits('execute')"
		>Применить</AButton>
		<AButton
			class="text-neutral-600 text-12"
			:class="[
				preset === 'desk' && 'py-8 px-24',
				preset === 'mob' && 'p-14'
			]"
			:disabled="disabled"
			@click="emits('reset')"
		>Очистить</AButton>
	</div>
</template>
<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";

withDefaults(
	defineProps<{
		disabled?: boolean;
		preset?: "mob" | "desk";
	}>(),
	{
		disabled: false,
		preset: "mob",
	}
);

const emits = defineEmits(["execute", "reset"]);
</script>
