<template>
	<component
		:is="component"
		v-if="!isFallback"
		:class="classes"
		v-bind="$attrs"
		@error="isFallback = true"
	/>
	<slot v-else name="fallback">
		<div v-if="preset === ImagePreset.COIN" class="bg-primary-300 min-w-30 max-w-30 min-h-30 max-h-30 p-6 rounded-full">
			<IconCoinsDollar class="text-white/80 w-full h-full" />
		</div>
		<div v-if="preset === ImagePreset.AVATAR" class="flex justify-center items-center w-full h-full">
			<IconPerson class="text-white/70 w-[60%] h-[60%]" />
		</div>
	</slot>
</template>
<script setup lang="ts">
import IconCoinsDollar from "@/assets/icons/coins-dollar.svg";
import IconPerson from "@/assets/icons/person.svg";
import { NuxtImg } from "#components";

const props = withDefaults(
	defineProps<{
		isNuxtImg?: boolean;
		preset?: ImagePreset;
	}>(),
	{
		isNuxtImg: true,
		preset: undefined,
	}
);

const attrs = useAttrs();

const isFallback = ref(!attrs.src);

watch(
	() => attrs.src,
	(newSrc) => isFallback.value = !newSrc
);

const component = computed(() => props.isNuxtImg ? markRaw(NuxtImg) : "img");

const classes = computed(() => {
	switch (props.preset) {
		case ImagePreset.COIN:
			return "min-w-20 max-w-20 min-h-20 max-h-20 object-contain";
		case ImagePreset.AVATAR:
			return "object-cover w-full h-full";
		default:
			return "";
	}
});
</script>
