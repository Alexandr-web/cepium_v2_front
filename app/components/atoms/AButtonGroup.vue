<template>
	<div class="flex flex-col gap-8" :class="[disabled && 'opacity-50']">
		<h3 class="text-12 font-semibold tracking-wider uppercase text-neutral-500">{{ label }}</h3>
		<div 
			ref="wrapper" 
			class="flex scroll-block scroll-block--without-controls overflow-auto w-min max-w-full min-w-0 bg-neutral-200 p-4 rounded-10 mx-auto lg:mx-0 shadow-inner"
		>
			<ul class="flex items-center relative z-1 w-max">
				<div
					class="transition-all cubic-bezier(0.4, 0, 0.2, 1) absolute -z-1 top-0 left-0 bg-primary-600 rounded-8 h-full min-h-0 shadow-sm shadow-primary-500/10"
					:class="[
						!value && 'opacity-0',
						value && 'opacity-100'
					]"
					:style="floatingStyles"
				/>
				
				<li
					v-for="(item, idx) in items"
					:key="idx"
					ref="group"
					class="select-none py-8 px-24 transition-colors text-13 whitespace-nowrap rounded-8 tap"
					:data-value="item.value"
					:class="[
						value === item.value && 'text-white',
						value !== item.value && 'text-neutral-600 hover:text-neutral-700',
						!disabled && 'cursor-pointer'
					]"
					@click="!disabled && setValue(item.value, $event.currentTarget)"
				>
					{{ item.label }}
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		items?: TSelectItem[];
		label?: string;
		disabled?: boolean;
	}>(),
	{
		items: () => [],
		label: "",
		disabled: false,
	}
);

export type ButtonGroupExpose = {
	setDefaultValue: () => Promise<void>;
};

defineOptions({ name: "ButtonGroup" });

const value = defineModel<string>({ default: "" });
const floatingStyles = ref({});

const wrapper = useTemplateRef("wrapper");
const group = useTemplateRef("group");

const setValue = (val: string, el?: unknown) => {
	if (!(el instanceof HTMLElement)) return;

	const { offsetLeft = 0, offsetWidth = 0 } = el;

	floatingStyles.value = { 
		transform: `translateX(${offsetLeft}px)`, 
		width: `${offsetWidth}px`,
		willChange: "transform, width",
	};
	value.value = val;

	wrapper.value?.scrollTo({ behavior: "smooth", left: offsetLeft });
};

const setDefaultValue = async () => {
	await nextTick();
	const el = group.value?.find((i) => i.dataset.value === value.value);
	if (el) setValue(el.dataset.value ?? "", el);
};

// Следим за изменением размеров контейнера через ResizeObserver
// Это решает проблему нулевых размеров внутри модалок при их открытии
if (import.meta.client) useResizeObserver(wrapper, setDefaultValue);

onMounted(setDefaultValue);

defineExpose({ setDefaultValue });
</script>
