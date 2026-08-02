<template>
	<form
		class="flex flex-col rounded-12 border border-solid border-neutral-200/60 bg-neutral-100/50"
		:class="[
			mode === 'default' && 'p-24 gap-20',
			mode === 'grid' && 'p-20 gap-16'
		]"
		@submit.prevent="emits('send', formattedData)"
	>
		<div
			:class="[
				mode === 'default' && 'flex flex-col gap-16',
				mode === 'grid' && 'grid grid-cols-1 lg:grid-cols-2 gap-16',
				fieldsListClasses
			]"
		>
			<component
				:is="item.component"
				v-for="(item, idx) in fields"
				:key="idx"
				v-model="item.value"
				v-model:error="item.error"
				:check="item.check"
				:placeholder="item.placeholder"
				:label="item.label"
				:prepend-icon="item.prependIcon"
				:type="item.type"
				:items="item.items"
				:disabled="item.disabled"
				:search="item.search"
				:max="item.max"
				:min="item.min"
				:show-tooltip="item.showTooltip"
				:format="item.format"
				:size="item.size"
				:class="item.classes"
			/>
		</div>
		<slot name="content" />
		<slot name="footer" />
	</form>
</template>

<script setup lang="ts" generic="TSendData">
const props = withDefaults(
	defineProps<{
		fields?: TGeneralFormField[];
		mode?: "default" | "grid";
		fieldsListClasses?: string;
		normalizedData: (fields: TGeneralFormField[]) => TSendData;
	}>(),
	{
		fields: () => [],
		mode: "default",
		fieldsListClasses: "",
	}
);

const emits = defineEmits<{ send: [TSendData] }>();

const formattedData = computed<TSendData>(() => props.normalizedData(props.fields));
</script>
