<template>
	<div class="flex items-center justify-between h-65 p-24 bg-neutral-100">
		<div class="flex items-center gap-8">
			<component :is="icon" v-if="icon" class="text-primary-800 w-18 h-18" />
			<h2 v-if="title" class="text-20 font-semibold leading-[1.2] text-neutral-800">{{ title }}</h2>
		</div>
		<slot />
	</div>
</template>
<script setup lang="ts">
import IconCardTravelOutlineRounded from "@/assets/icons/card-travel-outline-rounded.svg";
import IconViewList from "@/assets/icons/view-list.svg";

const props = withDefaults(
	defineProps<{
		title?: string;
		icon?: string;
	}>(),
	{
		icon: "",
		title: "",
	}
);

const icon = computed(() => {
	switch (props.icon) {
		case "card-travel-outline-rounded":
			return IconCardTravelOutlineRounded;
		case "view-list":
			return IconViewList;
		default:
			return null;
	}
});
</script>
