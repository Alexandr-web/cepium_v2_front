<template>
	<div class="flex flex-col gap-16 bg-black-500 rounded-8 border-solid border-1 border-neutral-100 bg-neutral-100/50 p-24">
		<Input
			v-for="item in fields"
			:key="item.name"
			v-model="item.value"
			:placeholder="item.placeholder"
			:label="item.label"
			:type="item.type"
			:preppend-icon="item.preppendIcon"
		/>
		<button class="group hover:bg-primary-900 transition-colors flex items-center justify-center cursor-pointer gap-8 bg-primary-800 rounded-4 h-56 lg:mt-16">
			<span class="uppercase text-primary-100 text-14 lg:text-16 font-bold">Войти</span>
			<Icon class="group-hover:translate-x-[50%] transition w-16 lg:w-18 h-16 lg:h-18 text-black" name="memory:arrow-right" />
		</button>
		<slot name="footer" />
	</div>
</template>
<script setup lang="ts">
import Input from "@/components/atoms/Input.vue";
import type { TGeneralFormInput } from "@/types/components";

defineProps<{
	fields: TGeneralFormInput[];
}>();
</script>
