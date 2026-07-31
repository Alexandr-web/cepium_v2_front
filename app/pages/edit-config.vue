<template>
	<div class="flex flex-col">
		<LazyOrganismsConfigsForm
			hydrate-on-visible
			title="Изменение конфига"
			btn-text="Изменить"
			:strategies="strategies"
			:is-pending-exchanges="isPendingExchanges"
			:is-pending-strategy="isPendingStrategy"
			:is-pending-config="isPendingConfig"
			:data="config"
			@execute="({ data }) => changeConfig(data)"
		/>
	</div>
</template>
<script setup lang="ts">
import { useStrategy } from "@/composables/api/useStrategies";
import { useExchanges } from "@/composables/api/useExchanges";
import { useConfig, useChangeOne } from "@/composables/api/useConfigs";

const route = useRoute();
const router = useRouter();
const configId = computed(() => String(route.params.id));

const { data: configData, suspense: suspenseConfig } = useConfig(configId);

await suspenseConfig();

if (!configData.value) {
	throw createError({
		status: 404,
		message: "Такого конфига не существует",
		fatal: true,
	});
}

const { mutate: changeConfig, isPending: isPendingConfig } = useChangeOne(configId, () => router.push({ name: "configs" }));
const { data: strategiesData, suspense: suspenseStrategy, isPending: isPendingStrategy } = useStrategy();
const { suspense: suspenseExchanges, isPending: isPendingExchanges } = useExchanges();

await Promise.all([suspenseStrategy(), suspenseExchanges()]);

const config = computed(() => configData.value?.data ?? {});
const strategies = computed(() => strategiesData.value?.data ?? []);
</script>
