<template>
	<div class="flex flex-col gap-6">
		<h3
			v-if="label"
			class="text-12 lg:text-14 transition"
			:class="[
				error && 'text-secondary-500',
				!error && 'text-primary-700'
			]"
		>{{ label }}</h3>
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
			<div ref="reference" class="p-12 flex items center justify-between gap-10" @click="!disabled && (isOpen = !isOpen)">
				<span v-if="inputLabel" class="text-neutral-800 select-none truncate" :title="inputLabel">{{ inputLabel }}</span>
				<Icon
					name="material-symbols:keyboard-arrow-down-rounded"
					class="text-neutral-800 w-24 h-24"
					:class="[isOpen && 'rotate-x-180']"
				/>
			</div>
			<div
				v-if="isOpen"
				ref="floating"
				class="scroll-block w-full border-1 border-solid border-neutral-400 rounded-b-4 lg:rounded-b-8 bg-primary-200 z-99 overflow-auto max-h-180 lg:max-h-280"
				:style="floatingStyles"
			>
				<ul v-if="items.length" class="flex flex-col">
					<li
						v-for="(item, idx) in items"
						:key="idx"
						class="flex items-center cursor-pointer p-10 text-neutral-800 text-14 lg:text-15 odd:bg-neutral-300/70 last:rounded-b-4 lg:last:rounded-b-8"
						@click="select(item)"
					>
						<ARadio :model-value="item.value === value" :label="item.label" />
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useFloating } from "@floating-ui/vue";
import ARadio from "@/components/atoms/ARadio.vue";

const {
	items,
	placeholder = "",
	label = "",
	disabled: _disabled = false,
} = defineProps<{
	placeholder?: string;
	label?: string;
	disabled?: boolean;
	items: TSelectItem[];
}>();

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

const selectedLabel = computed(() => items.find((i) => i.value === value.value)?.label);
const inputLabel = computed(() => selectedLabel.value || placeholder);
const disabled = computed(() => _disabled ?? !items.length);

const select = (item: TSelectItem) => {
	error.value = "";
	value.value = item.value;
};
</script>
