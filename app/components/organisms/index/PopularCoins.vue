<template>
	<section class="flex flex-col gap-16">
		<h2 class="font-bold text-20 lg:hidden">Популярные монеты</h2>
		<div class="flex lg:hidden flex-col gap-8">
			<MobCard v-for="coin in coins" :key="coin.id" :coin="coin" />
		</div>
		<Table :coins="coins" />
	</section>
</template>
<script setup lang="ts">
import MobCard from "@/components/molecules/coin/MobCard.vue";
import Table from "@/components/molecules/coin/Table.vue";
import type Coin from "@/models/Coin";

defineProps<{ coins: Coin[] }>();
</script>
