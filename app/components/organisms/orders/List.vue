<template>
	<section class="flex flex-col justify-between gap-15 grow">
		<template v-if="orders.length">
			<div class="flex lg:hidden flex-col gap-8">
				<Card
					v-for="(item, idx) in orders"
					:key="idx"
					:card="item"
				/>
			</div>
			<Table :orders="orders" />
			<APagination
				v-model:page="page"
				:total="totalItems"
				:per-page="PER_PAGE"
			/>
		</template>
		<Empty v-else />
	</section>
</template>
<script setup lang="ts">
import Card from "@/components/molecules/orders/Card.vue";
import Table from "@/components/molecules/orders/Table.vue";
import APagination from "@/components/atoms/APagination.vue";
import Empty from "@/components/molecules/common/Empty.vue";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useOrders } from "@/composables/api/useOrders";

const props = withDefaults(
	defineProps<{
		filters?: Record<string, string>;
	}>(),
	{
		filters: () => ({}),
	}
);

const exchangeStore = useExchangeStore();
const { searchOrders } = useOrders();

const PER_PAGE = 10;

const page = ref(1);
const orders = ref<TOrder[]>([]);
const totalItems = ref(0);

const fetchOrders = async () => {
	try {
		const res = await searchOrders(exchangeStore?.activeExchange ?? "", {
			...props.filters,
			l: PER_PAGE,
			o: (page.value - 1) * PER_PAGE,
		});

		orders.value = res.data.orders;
		totalItems.value = res.data.total ?? 1; // заменить на бек
	} catch (err) {
		console.error(err);
	}
};

watch(
	() => props.filters,
	async () => {
		if (page.value !== 1) {
			page.value = 1;
			return;
		}

		await fetchOrders();
	},
	{ deep: true }
);

watch(page, fetchOrders);

onMounted(fetchOrders);
</script>
