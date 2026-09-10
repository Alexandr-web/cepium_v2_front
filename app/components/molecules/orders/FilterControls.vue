<template>
	<div class="flex flex-col" :class="classes">
		<AButton
			class="w-full text-14 rounded-8"
			:class="btnClasses"
			:disabled="disabled"
			:mode="ButtonMode.PRIMARY_BORDER"
			@click="emits('execute')"
		>Применить</AButton>
		<AButton
			class="text-neutral-600 text-12"
			:class="btnClasses"
			:disabled="disabled"
			@click="emits('reset')"
		>Очистить</AButton>
	</div>
</template>
<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";

const props = withDefaults(
	defineProps<{
		disabled?: boolean;
		preset?: FilterControlsPreset;
	}>(),
	{
		disabled: false,
		preset: FilterControlsPreset.MOBILE,
	}
);

const emits = defineEmits(["execute", "reset"]);

const classes = computed(() => {
	switch (props.preset) {
		case FilterControlsPreset.DESKTOP:
			return "gap-5";
		case FilterControlsPreset.MOBILE:
			return "gap-20";
		default:
			return "";
	}
});

const btnClasses = computed(() => {
	switch (props.preset) {
		case FilterControlsPreset.DESKTOP:
			return "py-8 px-24";
		case FilterControlsPreset.MOBILE:
			return "p-14";
		default:
			return "";
	}
});
</script>
