<template>
	<section class="w-full lg:max-w-1200 lg:mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
			<ExchangeCard
				v-for="item in exchanges"
				:key="item.id"
				:item="item"
				@click="exchange = item"
			/>
		</div>
	</section>
	<Teleport to="body">
		<Modal v-model="showModal">
			<h3 class="text-24 font-semibold text-white mb-12 text-center">{{ title }}</h3>
			<ExchangeForm
				:exchange="exchange"
				:credentials="credentials"
				@success="showModal = false"
			/>
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import ExchangeCard from "@/components/molecules/profile/ExchangeCard.vue";
import ExchangeForm from "@/components/molecules/profile/ExchangeForm.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useCredentials } from "@/composables/api/useCredentials";
import type Exchange from "@/models/Exchange";

const exchangeStore = useExchangeStore();

const exchange = ref<Exchange|null>(null);

const exchanges = computed(() => exchangeStore.getAllExchanges());
const title = computed(() => exchange.value?.name ?? "-");
const showModal = computed({
	get: () => !!exchange.value,
	set: (v) => { if (!v) exchange.value = null; },
});

const { data: credentials } = useCredentials({
	query: { exchangeName: () => exchange.value?.name ?? "" },
	enabled: () => !!exchange.value,
});
</script>
