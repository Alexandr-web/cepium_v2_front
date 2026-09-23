<template>
	<section class="grid grid-cols-1 lg:grid-cols-3 gap-12">
		<BalanceCard data-allow-mismatch="" />
		<PositionsCard data-allow-mismatch="" />
		<PnlCard data-allow-mismatch="" />
	</section>
</template>
<script setup lang="ts">
import BalanceCard from "@/components/molecules/index/BalanceCard.vue";
import PositionsCard from "@/components/molecules/index/PositionsCard.vue";
import PnlCard from "@/components/molecules/index/PnlCard.vue";
</script>
