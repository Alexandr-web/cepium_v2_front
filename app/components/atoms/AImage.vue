<template>
	<img
		v-if="!isFallback"
		:class="classes"
		v-bind="$attrs"
		@error="isFallback = true"
	>
	<slot v-else name="fallback">
		<div v-if="preset === ImagePreset.COIN" class="bg-primary-300 min-w-20 max-w-20 min-h-20 max-h-20 p-4 rounded-full">
			<IconCoinsDollar class="text-white/80 w-full h-full" />
		</div>
		<div v-else-if="preset === ImagePreset.AVATAR" class="flex justify-center items-center w-full h-full">
			<IconPerson class="text-white/70 w-[60%] h-[60%]" />
		</div>
	</slot>
</template>
<script setup lang="ts">
import IconCoinsDollar from "@/assets/icons/coins-dollar.svg";
import IconPerson from "@/assets/icons/person.svg";

const props = withDefaults(
	defineProps<{
		preset?: ImagePreset;
	}>(),
	{
		preset: undefined,
	}
);

defineOptions({ inheritAttrs: false });

const attrs = useAttrs();

const isFallback = ref(!attrs.src);

watch(
	() => attrs.src,
	(newSrc) => isFallback.value = !newSrc
);

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
