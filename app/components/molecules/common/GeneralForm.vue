<template>
	<form
		class="flex flex-col gap-16 bg-black-500 rounded-8 border-solid border-1 border-neutral-100 bg-neutral-100/50"
		:class="[
			mode === 'default' && 'p-24',
			mode === 'user' && 'p-20',
		]"
		@submit.prevent="emits('send', formattedData)"
	>
		<div
			class="gap-16"
			:class="[
				mode === 'default' && 'flex flex-col',
				mode === 'user' && 'grid grid-cols-1 lg:grid-cols-2',
			]"
		>
			<component
				:is="item.component"
				v-for="item in fields"
				:key="item.name"
				v-model="item.value"
				v-model:error="item.error"
				:check="item.check"
				:placeholder="item.placeholder"
				:label="item.label"
				:preppend-icon="item.preppendIcon"
				:type="item.type"
				:items="item.items"
				:disabled="item.disabled"
			/>
		</div>
		<slot name="content" />
		<slot name="footer" />
	</form>
</template>
<script setup lang="ts" generic="TSendData">
import type { PropType } from "vue";

const { normalizedData, fields } = defineProps({
	fields: {
		type: Array as PropType<TGeneralFormField[]>,
		default: () => [],
	},
	normalizedData: {
		type: Function as PropType<(fields: TGeneralFormField[]) => TSendData>,
		required: true,
	},
	mode: {
		type: String,
		default: "default",
		validator: (s: string) => ["default", "user"].includes(s),
	},
});

const emits = defineEmits<{ send: [TSendData] }>();

const formattedData = computed<TSendData>(() => normalizedData(fields));
</script>
