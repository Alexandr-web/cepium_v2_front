<template>
	<section class="flex flex-col gap-24">
		<OrdersFilters v-model="filters" />
		<div class="flex flex-col justify-between gap-15 grow">
			<div v-if="orders.length" class="flex lg:hidden flex-col gap-8">
				<Card
					v-for="(item, idx) in orders"
					:key="idx"
					:card="item"
				/>
			</div>
			<Empty v-else class="lg:hidden" />
			<Table :orders="orders" :is-pending="isPending" />
			<APagination
				v-if="orders.length"
				v-model:page="page"
				:total="totalItems"
				:per-page="PER_PAGE"
				:is-pending="isPending"
			/>
		</div>
	</section>
</template>
<script setup lang="ts">
import Card from "@/components/molecules/orders/Card.vue";
import Table from "@/components/molecules/orders/Table.vue";
import APagination from "@/components/atoms/APagination.vue";
import Empty from "@/components/molecules/common/Empty.vue";
import OrdersFilters from "@/components/organisms/orders/Filters.vue";
import { useExchangeStore } from "@/store/useExchangeStore";
import { useOrders } from "@/composables/api/useOrders";

const exchangeStore = useExchangeStore();
const { searchOrders } = useOrders();

const PER_PAGE = 10;

const filters = ref<Record<string, string>>({});

const page = ref(1);
const orders = ref<Order[]>([]);
const totalItems = ref(0);
const isPending = ref(false);

const fetchOrders = async () => {
	isPending.value = true;

	try {
		const res = await searchOrders(exchangeStore?.activeExchange ?? "", {
			...filters.value,
			l: PER_PAGE,
			o: (page.value - 1) * PER_PAGE,
		});

		orders.value = res.data.orders;
		totalItems.value = res.data.total;
	} catch (err) {
		console.error(err);

		if (err instanceof Error) {
			push.error(getRequestErrorMessage(err));
		}
	} finally {
		isPending.value = false;
	}
};

watch(page, fetchOrders);

watch(
	filters,
	async () => {
		if (page.value !== 1) {
			page.value = 1;
			return;
		}

		await fetchOrders();
	},
	{ deep: true }
);
</script>
