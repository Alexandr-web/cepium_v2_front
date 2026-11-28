<template>
	<header class="flex items-center justify-between bg-neutral-200 lg:bg-neutral-200/70 lg:backdrop-blur-xl relative z-10 h-64 border-b border-solid border-b-neutral-300/60 py-16 px-16 lg:px-24">
		<NuxtLink class="h-full lg:max-w-208 lg:w-full lg:flex lg:justify-center" :to="{ name: 'home' }">
			<IconLogo class="w-80 lg:w-auto h-full object-contain" />
		</NuxtLink>
		<div class="flex items-center gap-12 lg:gap-24">
			<Connection class="hidden lg:flex" />
			<ASelect
				v-if="items.length"
				v-model="currencyStore.activeCurrency"
				class="w-90 lg:w-120"
				:mode="SelectMode.SMALL"
				:items="items"
			/>
			<Menu />
		</div>
	</header>
</template>

<script setup lang="ts">
import Menu from "@/components/molecules/layout/HeaderMenu.vue";
import IconLogo from "@/assets/icons/logo.svg";
import Connection from "@/components/atoms/Connection.vue";
import ASelect from "@/components/atoms/ASelect.vue";
import { useCurrencyStore } from "@/store/useCurrencyStore";

const currencyStore = useCurrencyStore();

const items = computed<SelectItem[]>(() =>
	Object.keys(currencyStore.rates)
		.map((key) => ({
			label: key,
			value: key,
		}))
);
</script>
