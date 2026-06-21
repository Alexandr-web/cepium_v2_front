<template>
	<div class="flex flex-col gap-6">
		<h3 v-if="label" class="text-12 lg:text-14 text-primary-700">{{ label }}</h3>
		<div class="group hover:border-white/10 transition flex items-center px-16 bg-neutral-100 h-48 rounded-4 border-solid border-1 border-white/5">
			<Icon
				v-if="preppendIcon"
				:name="preppendIcon"
				class="text-primary-700 w-15 lg:w-18 h-15 lg:h-18 block mr-8"
			/>
			<input
				v-model.trim="value"
				class="border-none bg-transparent grow h-full text-14 lg:text-16 text-neutral-500"
				:placeholder="placeholder"
				:type="inputType"
			>
			<button
				v-if="type === 'password'"
				class="cursor-pointer w-18 lg:w-22 h-16 lg:h-20 flex justify-center items-center ml-8"
				type="button"
				@click="showPassword = !showPassword"
			>
				<Icon v-show="showPassword" class="w-full h-full text-primary-700" name="material-symbols:visibility-off-outline" />
				<Icon v-show="!showPassword" class="w-full h-full text-primary-700" name="material-symbols:visibility-outline-rounded" />
			</button>
		</div>
	</div>
</template>
<script setup lang="ts">
const { type } = defineProps({
	label: {
		type: String,
		default: "",
	},
	type: {
		type: String,
		default: "text",
	},
	placeholder: {
		type: String,
		default: "",
	},
	preppendIcon: {
		type: String,
		default: "",
	},
});

const value = defineModel({ type: String, default: "" });

const showPassword = ref(false);

const inputType = computed(() => {
	if (type === "text") return type;
	return !showPassword.value ? "password" : "text";
});
</script>
