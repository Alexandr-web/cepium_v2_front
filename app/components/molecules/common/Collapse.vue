<template>
	<div class="flex flex-col rounded-8 border border-solid bg-neutral-100/80 border-white/10">
		<div
			class="flex items-center justify-between gap-10 cursor-pointer p-16 transition-colors duration-200 hover:bg-neutral-300/50 rounded-8"
			:class="[isActive && 'bg-neutral-300/30']"
			@click="toggleAccordion"
		>
			<div class="flex items-center gap-10">
				<component
					:is="icon"
					v-if="icon"
					class="w-20 h-20 text-primary-600 duration-200"
				/>
				<h3 class="text-15 lg:text-16 text-neutral-900 select-none">{{ label }}</h3>
			</div>
			<IconKeyboardArrowDownRounded
				class="w-24 h-24 text-neutral-700 transition duration-200"
				:class="[isActive && 'rotate-x-180']"
			/>
		</div>
		<div
			class="grid transition-[grid-template-rows] duration-300 ease-in-out"
			:class="[isActive && 'grid-rows-[1fr]', !isActive && 'grid-rows-[0fr]']"
			@transitionend="onTransitionEnd"
		>
			<div class="min-h-0" :class="[isContentVisible && 'overflow-visible', !isContentVisible && 'overflow-hidden']">
				<div class="p-12 grow">
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import IconPersonEditOutlineRounded from "@/assets/icons/person-edit-outline-rounded.svg";
import IconLockOutline from "@/assets/icons/lock-outline.svg";
import IconKeyboardArrowDownRounded from "@/assets/icons/keyboard-arrow-down-rounded.svg";
import IconPartnerExchangeRounded from "@/assets/icons/partner-exchange-rounded.svg";

const props = withDefaults(
	defineProps<{
		isOpen?: boolean;
		label: string;
		prependIcon?: string;
	}>(),
	{
		isOpen: false,
		prependIcon: "",
	}
);

const icon = computed(() => {
	switch (props.prependIcon) {
		case "person-edit-outline-rounded":
			return IconPersonEditOutlineRounded;
		case "lock-outline":
			return IconLockOutline;
		case "partner-exchange-rounded":
			return IconPartnerExchangeRounded;
		default:
			return null;
	}
});

const isActive = ref(props.isOpen);
const isContentVisible = ref(props.isOpen);

const toggleAccordion = () => {
	// при закрытии сразу включаем обрезку, чтобы контент не протекал во время сворачивания
	if (isActive.value) isContentVisible.value = false;
	isActive.value = !isActive.value;
};

const onTransitionEnd = (event: TransitionEvent) => {
	if (event.propertyName === "grid-template-rows" && isActive.value) {
		isContentVisible.value = true;
	}
};
</script>
