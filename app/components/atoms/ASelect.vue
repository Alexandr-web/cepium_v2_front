<template>
	<div class="flex flex-col gap-6">
		<LabelField v-model:error="error" :label="label" :tooltip-text="tooltipText" />
		<div
			ref="selectRef"
			class="relative h-50 bg-primary-200 flex flex-col"
			:class="[
				isOpen && 'rounded-t-4 lg:rounded-t-8',
				!isOpen && 'rounded-4 lg:rounded-8',
				disabled && 'opacity-50',
				!disabled && 'cursor-pointer'
			]"
		>
			<div ref="reference" class="p-12 flex items-center justify-between gap-10" @click="!disabled && (isOpen = !isOpen)">
				<span v-if="inputLabel" class="text-neutral-800 select-none truncate" :title="inputLabel">{{ inputLabel }}</span>
				<IconKeyboardArrowDownRounded
					class="text-neutral-800 w-24 h-24 transition"
					:class="[isOpen && 'rotate-x-180']"
				/>
			</div>
			<Transition
				enter-active-class="transition-all duration-150 ease-out"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-active-class="transition-all duration-100 ease-in"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
			>
				<div
					v-if="isOpen"
					ref="floating"
					class="scroll-block w-full rounded-b-8 bg-neutral-200 z-99 overflow-auto max-h-180 lg:max-h-280 border-x border-b border-x-white/10 border-b-white/10"
					:style="floatingStyles"
				>
					<ul v-if="items.length" class="flex flex-col">
						<li
							v-for="(item, idx) in items"
							:key="idx"
							class="flex items-center cursor-pointer p-10 text-neutral-800 text-14 lg:text-15 odd:bg-neutral-300/40 transition-colors duration-150 last:rounded-b-8"
							:class="[item.value === value && 'text-neutral-950']"
							@click="select(item)"
						>
							<ACheckbox
								:model-value="item.value === value"
								:label="item.label"
								@update:model-value="(v: boolean) => value = v ? item.value : ''"
							/>
						</li>
					</ul>
				</div>
			</Transition>
		</div>
	</div>
</template>
<script setup lang="ts">
import IconKeyboardArrowDownRounded from "@/assets/icons/keyboard-arrow-down-rounded.svg";
import ACheckbox from "@/components/atoms/ACheckbox.vue";
import LabelField from "@/components/atoms/LabelField.vue";
import { useFloating } from "@floating-ui/vue";

const props = withDefaults(
	defineProps<{
		placeholder?: string;
		label?: string;
		disabled?: boolean;
		tooltipText?: string;
		items: SelectItem[];
	}>(),
	{
		placeholder: "",
		label: "",
		tooltipText: "",
		disabled: false,
	}
);

const isOpen = ref(false);

const value = defineModel<string>({ default: "" });
const error = defineModel<string>("error", { default: "" });

const reference = useTemplateRef("reference");
const floating = useTemplateRef("floating");
const selectRef = useTemplateRef("selectRef");

const { floatingStyles } = useFloating(reference, floating, {
	placement: "bottom",
});

onClickOutside(selectRef, () => isOpen.value = false, { ignore: [floating] });

const selectedLabel = computed(() => props.items.find((i) => i.value === value.value)?.label);
const inputLabel = computed(() => selectedLabel.value || props.placeholder);
const disabled = computed(() => props.disabled ?? !props.items.length);

const select = (item: SelectItem) => {
	error.value = "";
	value.value = item.value;
};
</script>
