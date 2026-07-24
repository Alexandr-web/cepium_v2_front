<template>
	<Transition
		enter-active-class="duration-300 ease-out"
		enter-from-class="opacity-0"
		enter-to-class="opacity-100"
		leave-active-class="duration-200 ease-in"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
		@after-leave="emits('close')"
	>
		<div
			v-show="show"
			class="fixed top-0 left-0 w-screen h-dvh overflow-hidden z-999 bg-neutral-100/80 flex flex-col justify-end lg:justify-none"
		>
			<Transition
				enter-active-class="duration-300 ease-out transform transition-all"
				enter-from-class="translate-y-full opacity-0"
				enter-to-class="translate-y-0 opacity-100"
				leave-active-class="duration-200 ease-in transform transition-all"
				leave-from-class="translate-y-0 opacity-100"
				leave-to-class="translate-y-full opacity-0"
			>
				<div
					v-show="show"
					ref="target"
					class="bg-neutral-100 rounded-t-8 lg:rounded-8 border-t-1 w-full lg:border-1 border-solid border-t-white/10 lg:border-white/10 py-32 px-16 relative lg:m-auto"
					:class="[
						size === 'small' && 'lg:max-w-500',
						size === 'default' && 'lg:max-w-900'
					]"
				>
					<div class="lg:hidden absolute top-16 right-0 left-0 mx-auto w-36 h-2 bg-white/50 rounded-8"/>
					<slot />
				</div>
			</Transition>
		</div>
	</Transition>
</template>
<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

const { disabled } = defineProps({
	disabled: {
		type: Boolean,
		default: false,
	},
	size: {
		type: String,
		default: "default",
		validator: (v: string) => ["default", "small"].includes(v),
	},
});

const target = useTemplateRef("target");

const show = defineModel<boolean>({ default: false });

const emits = defineEmits(["close"]);

onClickOutside(target, () => {
	if (show.value && !disabled) show.value = false;
});
</script>
