<template>
	<div class="flex flex-col">
		<LazyOrganismsConfigsForm
			hydrate-on-visible
			title="Добавление конфига"
			btn-text="Добавить"
			:strategies="strategies"
			:is-pending-exchanges="isPendingExchanges"
			:is-pending-strategy="isPendingStrategy"
			:is-pending-config="isPendingConfig"
			@execute="({ data, exchangeName }) => createConfig({ body: data, exchangeName })"
		/>
	</div>
</template>
<script setup lang="ts">
import { useStrategy } from "@/composables/api/useStrategies";
import { useExchanges } from "@/composables/api/useExchanges";
import { useCreateOne } from "@/composables/api/useConfigs";

const router = useRouter();

const { data: strategiesData, suspense: suspenseStrategy, isPending: isPendingStrategy } = useStrategy();
const { suspense: suspenseExchanges, isPending: isPendingExchanges } = useExchanges();
const { mutate: createConfig, isPending: isPendingConfig } = useCreateOne(() => router.push({ name: "configs" }));

await Promise.all([suspenseStrategy(), suspenseExchanges()]);

const strategies = computed(() => strategiesData.value?.data ?? []);
</script>
