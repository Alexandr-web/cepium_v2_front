<template>
	<div class="flex items-center justify-center gap-10">
		<IconSentimentSadOutlineRounded v-if="!isPending" class="text-neutral-800 w-20 h-20" />
		<IconLoader v-else class="w-20 h-20" />
		<slot>
			<p class="text-neutral-800">Данные отсутствуют</p>
		</slot>
	</div>
</template>
<script setup lang="ts">
import IconSentimentSadOutlineRounded from "@/assets/icons/sentiment-sad-outline-rounded.svg";
import IconLoader from "@/assets/icons/loader.svg";

withDefaults(
	defineProps<{
		isPending?: boolean;
	}>(),
	{
		isPending: false,
	}
);
</script>
