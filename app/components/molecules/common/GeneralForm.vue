<template>
	<form
		class="flex flex-col rounded-12 border border-solid border-neutral-200/60 bg-neutral-100/50"
		:class="formClassesByMode"
		@submit.prevent="emits('send', formattedData)"
	>
		<div
			:class="[
				wrapperClassesByMode,
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
				:item-click-handler="item.itemClickHandler"
				:max="item.max"
				:min="item.min"
				:show-tooltip="item.showTooltip"
				:format="item.format"
				:size="item.size"
				:tooltip-text="item.tooltipText"
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
		fields?: GeneralFormField[];
		mode?: FormMode;
		fieldsListClasses?: string;
		normalizedData: (fields: GeneralFormField[]) => TSendData;
	}>(),
	{
		fields: () => [],
		mode: FormMode.DEFAULT,
		fieldsListClasses: "",
	}
);

const emits = defineEmits<{ send: [TSendData] }>();

const formattedData = computed<TSendData>(() => props.normalizedData(props.fields));
const formClassesByMode = computed(() => {
	switch (props.mode) {
		case FormMode.DEFAULT:
			return "p-24 gap-20";
		case FormMode.GRID:
			return "p-20 gap-16";
		default:
			return "";
	}
});

const wrapperClassesByMode = computed(() => {
	switch (props.mode) {
		case FormMode.DEFAULT:
			return "flex flex-col gap-16";
		case FormMode.GRID:
			return "grid grid-cols-1 lg:grid-cols-2 gap-16";
		default:
			return "";
	}
});
</script>
