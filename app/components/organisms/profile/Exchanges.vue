<template>
	<section class="flex flex-col">
		<h2 class="text-20 font-medium">Биржи</h2>
		<div class="flex flex-col gap-10">
			<ExchangeCard v-for="item in exchangeStore.getAllExchange()" :key="item.id" :item="item" />
		</div>
	</section>
</template>
<script setup lang="ts">
import ExchangeCard from "@/components/molecules/profile/ExchangeCard.vue";
import { useExchangeStore } from "@/store/useExchangeStore";

const exchangeStore = useExchangeStore();
</script>
