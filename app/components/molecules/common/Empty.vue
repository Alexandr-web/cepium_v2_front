<template>
	<div class="flex items-center justify-center gap-10">
		<IconSentimentSadOutlineRounded class="text-neutral-800 w-20 h-20" />
		<slot>
			<p class="text-neutral-800">Данные отсутствуют</p>
		</slot>
	</div>
</template>
<script setup lang="ts">
import IconSentimentSadOutlineRounded from "@/assets/icons/sentiment-sad-outline-rounded.svg";
</script>
