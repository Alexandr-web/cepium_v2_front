<template>
	<section class="flex flex-col gap-12 grow">
		<div class="flex flex-col">
			<h2 class="text-20 lg:text-24 font-semibold">Созданные конфиги <span v-if="configs.length" class="font-medium opacity-50">({{ configs.length }})</span></h2>
			<h3 class="text-16 lg:text-18 font-medium text-neutral-700 leading-[1.2em]">Управляйте параметрами автоматизированных стратегий и развертывайте их.</h3>
		</div>
		<div v-if="configs.length" class="grid grid-cols-1 lg:grid-cols-3 gap-16">
			<ConfigCard v-for="card in configs" :key="card.id" :card="card" />
			<NuxtLink
				class="group hover:border-neutral-500 transition flex items-center justify-center rounded-8 p-8 border-solid border-1 border-neutral-400 bg-neutral-300/50"
				:to="{ name: 'add-config' }"
			>
				<IconAdd class="w-22 lg:w-24 h-22 lg:h-24 group-hover:text-white transition text-white/80" />
			</NuxtLink>
		</div>
		<div v-else class="my-auto flex flex-col gap-10 items-center justify-center bg-primary-100/30 rounded-12 p-16 w-full lg:max-w-600 lg:mx-auto">
			<p class="text-14 lg:text-16 text-neutral-800 text-center">Ничего не найдено<br>Создайте новый конфиг</p>
			<NuxtLink class="group hover:bg-neutral-500 transition flex items-center justify-center rounded-8 p-8 bg-neutral-400" :to="{ name: 'add-config' }">
				<IconAdd class="w-22 lg:w-24 h-22 lg:h-24 group-hover:text-white transition text-white/80" />
			</NuxtLink>
		</div>
	</section>
</template>
<script setup lang="ts">
import IconAdd from "@/assets/icons/add-rounded.svg";
import ConfigCard from "@/components/molecules/configs/ConfigCard.vue";

defineProps<{
	configs: TConfigResponse[];
}>();
</script>
