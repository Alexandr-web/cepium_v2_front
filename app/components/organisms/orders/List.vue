<template>
	<section class="flex flex-col">
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
	</section>
</template>
<script setup lang="ts">
import Card from "@/components/molecules/orders/Card.vue";
import Table from "@/components/molecules/orders/Table.vue";

defineProps<{
	orders: TOrder[];
}>();
</script>
