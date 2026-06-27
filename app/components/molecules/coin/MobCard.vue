<template>
	<div class="flex items-center justify-between border-1 border-solid border-white/5 p-8 bg-neutral-100 rounded-8">
		<div class="flex gap-12 items-center">
			<div class="flex justify-center items-center p-7 rounded-12 w-40 h-40 border-1 border-solid border-white/5 bg-neutral-200 text-neutral-600 text-14 font-bold">
				{{ coin.symbol }}
			</div>
			<div class="flex flex-col">
				<h3 class="text-white text-14 font-bold">{{ coin.fullSymbol }}</h3>
				<span class="text-10 text-white/50 font-medium">Объем: {{ coin.prettyVolume24h }}</span>
			</div>
		</div>
		<div class="flex flex-col items-end">
			<span class="text-14 text-neutral-700">{{ coin.prettyCurrentPrice }}</span>
			<span
				class="text-12 font-medium"
				:class="[
					coin.change24hprct >= 0 && 'text-tertiary-500',
					coin.change24hprct < 0 && 'text-secondary-500',
				]"
			>{{ coin.prettyChange24hprct }}</span>
		</div>
	</div>
</template>
<script setup lang="ts">
import type Coin from "@/models/Coin";

defineProps<{ coin: Coin }>();
</script>
