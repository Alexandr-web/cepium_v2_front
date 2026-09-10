<template>
	<!-- @vue-generic {Order}-->
	<MTable
		class="hidden lg:flex"
		:columns="ordersColumns"
		:data="orders"
	>
		<template #cell-side="{ value }">
			<span
				class="p-10 rounded-8 font-medium"
				:class="[
					value === 'long' && 'text-tertiary-600 bg-tertiary-400/20',
					value === 'short' && 'text-secondary-500 bg-secondary-400/20'
				]"
			>{{ value }}</span>
		</template>
	</MTable>
</template>
<script setup lang="ts">
import MTable from "@/components/molecules/common/MTable.vue";

defineProps<{ orders: Order[] }>();
</script>
