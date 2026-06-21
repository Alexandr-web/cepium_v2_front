<template>
	<Transition
		enter-active-class="duration-300 ease-out"
		enter-from-class="opacity-0"
		enter-to-class="opacity-100"
		leave-active-class="duration-200 ease-in"
		leave-from-class="opacity-100"
		leave-to-class="opacity-0"
	>
		<div
			v-show="show"
			class="fixed w-screen h-screen overflow-hidden z-999 bg-neutral-100/80 flex flex-col justify-end"
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
					class="bg-neutral-100 rounded-t-8 border-t-1 border-solid border-t-white/10 py-32 px-16 relative"
				>
					<div
						v-if="$device.isMobile"
						class="absolute top-16 right-0 left-0 mx-auto w-36 h-2 bg-white/50 rounded-8"
					></div>
					<slot />
				</div>
			</Transition>
		</div>
	</Transition>
</template>
<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { useTemplateRef } from "vue";

const target = useTemplateRef("target");

const show = defineModel({ type: Boolean, default: false });

onClickOutside(target, () => show.value = false);
</script>
