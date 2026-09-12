<template>
	<div class="inline-block">
		<div
			ref="reference"
			class="inline-block"
			@mouseenter="showTooltip"
			@mouseleave="hideTooltip"
			@focusin="showTooltip"
			@focusout="hideTooltip"
		>
			<slot name="trigger" />
		</div>
		<Transition
			enter-active-class="transition duration-150 ease-out"
			enter-from-class="opacity-0 scale-95 translate-y-1"
			enter-to-class="opacity-100 scale-100 translate-y-0"
			leave-active-class="transition duration-100 ease-in"
			leave-from-class="opacity-100 scale-100 translate-y-0"
			leave-to-class="opacity-0 scale-95 translate-y-1"
		>
			<div
				v-if="isOpen"
				ref="floating"
				:style="floatingStyles"
				class="z-50 pointer-events-none"
			>
				<div
					ref="arrowEl"
					class="absolute z-0 w-12 h-12 rotate-45 rounded-2 bg-neutral-200 border border-neutral-400 shadow-sm shadow-black/40"
					:style="arrowStyles"
				/>
				<div
					class="relative z-10 p-12 rounded-8 max-w-xs leading-normal font-light tracking-tight text-center text-neutral-950 bg-primary-200 border border-neutral-300"
				>
					<slot name="content" />
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { useFloating, arrow, flip, shift, offset, autoUpdate, type Placement } from "@floating-ui/vue";

const props = withDefaults(
	defineProps<{
		placement?: Placement;
		offsetDistance?: number;
		disabled?: boolean;
	}>(),
	{
		placement: "top",
		offsetDistance: 8,
		disabled: false,
	}
);

const ARROW_SIZE = 12;
const ARROW_OFFSET = ARROW_SIZE / 2;

const isOpen = ref(false);

const reference = useTemplateRef("reference");
const floating = useTemplateRef("floating");
const arrowEl = useTemplateRef("arrowEl");

const { floatingStyles, placement: currentPlacement, middlewareData } = useFloating(reference, floating, {
	placement: () => props.placement,
	whileElementsMounted: autoUpdate,
	middleware: [
		offset(() => props.offsetDistance),
		flip(),
		shift({ padding: 5 }),
		arrow({ element: arrowEl }),
	],
	transform: false,
});

const arrowX = computed(() => middlewareData.value.arrow?.x);
const arrowY = computed(() => middlewareData.value.arrow?.y);

// Определяем, с какой стороны находится стрелочка по отношению к тултипу
const arrowSide = computed(() => {
	const side = currentPlacement.value.split("-")[0];

	switch (side) {
		case "right":
			return "left";
		case "bottom":
			return "top";
		case "left":
			return "right";
		default:
			return "bottom";
	}
});

const arrowStyles = computed(() => ({
	left: !arrowX.value ? "" : `${arrowX.value}px`,
	top: !arrowY.value ? "" : `${arrowY.value}px`,
	[arrowSide.value]: `calc(var(--spacing) * -${ARROW_OFFSET})`,
	borderTopColor: !props.placement.startsWith("bottom") ? undefined : "transparent",
	borderLeftColor: !props.placement.startsWith("right") ? undefined : "transparent",
	borderRightColor: !props.placement.startsWith("left") ? undefined : "transparent",
	borderBottomColor: !props.placement.startsWith("top") ? undefined : "transparent",
}));

const showTooltip = () => !props.disabled && (isOpen.value = true);
const hideTooltip = () => isOpen.value = false;
</script>
