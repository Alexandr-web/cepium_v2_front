<template>
	<section class="w-full lg:max-w-1200 lg:mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
			<ExchangeCard
				v-for="item in exchangeStore.getAllExchange()"
				:key="item.id"
				:item="item"
				@click="exchange = item"
			/>
		</div>
	</section>
	<Teleport to="body">
		<Modal v-model="showModal">
			<ExchangeForm :exchange="exchange" :credentials="credentials" :is-pending="isFetching" />
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

const { data: credentials, isFetching } = useCredentials({
	query: { exchangeName: computed(() => exchange.value?.id ?? "") },
	enabled: () => !!exchange.value,
});

const showModal = computed({
	get: () => !!exchange.value,
	set: (v) => { if (!v) exchange.value = null; },
});
</script>
