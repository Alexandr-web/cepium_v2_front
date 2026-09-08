<template>
	<div class="flex justify-between">
		<div class="flex items center gap-5">
			<h3
				v-if="label"
				class="text-12 lg:text-14 transition"
				:class="[
					error && 'text-secondary-500',
					!error && 'text-primary-700'
				]"
			>
				{{ label }}
			</h3>
			<p v-if="count" class="text-neutral-600 text-12 lg:text-14">({{ count }})</p>
		</div>
		<Tooltip v-if="tooltipText">
			<template #trigger>
				<IconHelpRounded class="w-16 h-16 text-white/80" />
			</template>
			<template #content>
				{{ tooltipText }}
			</template>
		</Tooltip>
	</div>
</template>
<script setup lang="ts">
import Tooltip from "@/components/molecules/common/Tooltip.vue";
import IconHelpRounded from "@/assets/icons/help-rounded.svg";

withDefaults(
	defineProps<{
		label: string;
		tooltipText?: string;
		count?: number|string;
	}>(),
	{
		tooltipText: "",
		count: 0,
	}
);

const error = defineModel<string>("error", { default: "" });
</script>
