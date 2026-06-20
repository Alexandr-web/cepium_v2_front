<template>
	<div class="flex flex-col gap-16 bg-black-500 rounded-8 shadow-[0_25px_50px_-12px_#000000/25] bg-neutral-100/50 p-24">
		<Input
			v-for="item in fields"
			:key="item.name"
			v-model="item.value"
			:placeholder="item.placeholder"
			:label="item.label"
			:type="item.type"
			:preppend-icon="item.preppendIcon"
		/>
		<button class="flex items-center justify-center gap-8 bg-primary-800 rounded-4 h-56">
			<span class="uppercase text-primary-100 text-14 font-bold">Войти</span>
			<Icon class="w-16 h-16 text-black" name="memory:arrow-right" />
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
