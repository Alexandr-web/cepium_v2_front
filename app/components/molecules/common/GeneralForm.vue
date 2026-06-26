<template>
	<form
		class="flex flex-col gap-16 bg-black-500 rounded-8 border-solid border-1 border-neutral-100 bg-neutral-100/50 p-24"
		@submit.prevent="emits('send', formattedData)"
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
			:type="item.type"
			:preppend-icon="item.preppendIcon"
		/>
		<AButton
			class="group hover:bg-primary-900 transition-colors flex items-center justify-center cursor-pointer gap-8 bg-primary-800 rounded-4 h-56 lg:mt-16"
			type="submit"
			:disabled="disabledBtn"
		>
			<span class="uppercase text-primary-100 text-14 lg:text-16 font-medium">Войти</span>
			<Icon class="group-hover:translate-x-[50%] transition min-w-16 lg:min-w-18 max-w-16 lg:max-w-18 min-h-16 lg:min-h-18 max-h-16 lg:max-h-18 text-black" name="material-symbols:keyboard-double-arrow-right" />
		</AButton>
		<slot name="footer" />
	</form>
</template>
<script setup lang="ts" generic="TSendData">
import AButton from "@/components/atoms/AButton.vue";
import type { TGeneralFormField } from "@/types/components";

const { normalizedData, fields } = defineProps<{
	fields: TGeneralFormField[];
	disabledBtn?: boolean;
	normalizedData: (fields: TGeneralFormField[]) => TSendData;
}>();

const emits = defineEmits<{ send: [TSendData] }>();

const formattedData = computed<TSendData>(() => normalizedData(fields));
</script>
