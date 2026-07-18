<template>
	<div class="flex items-center gap-5 py-6 px-12 rounded-12 bg-primary-300 border-1 border-solid border-primary-400">
		<span class="text-neutral-900 text-14">{{ label }}</span>
		<AButton class="w-24 h-24" @click="emits('remove')">
			<Icon name="material-symbols:close-small-outline-rounded" class="w-full h-full text-neutral-800" />
		</AButton>
	</div>
</template>
<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";

defineProps<{ label: string; }>();

const emits = defineEmits(["remove"]);
</script>
