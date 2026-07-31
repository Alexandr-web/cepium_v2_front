<template>
	<section class="flex flex-col gap-15">
		<template v-if="orders.length">
			<div class="flex lg:hidden flex-col gap-8">
				<Card
					v-for="(item, idx) in orders"
					:key="idx"
					:card="item"
				/>
			</div>
			<Table :orders="orders" />
		</template>
		<APagination
			v-model:page="page"
			:total="totalItems"
			:per-page="10"
		/>
	</section>
</template>
<script setup lang="ts">
import Card from "@/components/molecules/orders/Card.vue";
import Table from "@/components/molecules/orders/Table.vue";
import APagination from "@/components/atoms/APagination.vue";

defineProps<{
	orders: TOrder[];
}>();

const page = ref(1);
const totalItems = 100;
</script>
