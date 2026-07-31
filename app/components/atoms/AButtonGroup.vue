<template>
	<div class="flex flex-col gap-10">
		<h3 class="text-12 uppercase text-white/40">{{ label }}</h3>
		<div ref="wrapper" class="flex scroll-block scroll-block--without-controls overflow-auto w-min max-w-full min-w-0 bg-black p-4 rounded-8 mx-auto lg:mx-0">
			<ul class="flex items-center relative z-1 w-max">
				<div
					class="transition absolute -z-1 top-0 left-0 bg-primary-800 rounded-8 h-full min-h-0"
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
					class="select-none cursor-pointer py-10 px-40 transition text-14 font-medium whitespace-nowrap"
					:data-value="item.value"
					:class="[
						value === item.value && 'text-black',
						value !== item.value && 'text-neutral-800',
					]"
					@click="setValue(item.value, $event.currentTarget)"
				>{{ item.label }}</li>
			</ul>
		</div>
	</div>
</template>
<script setup lang="ts">
withDefaults(
	defineProps<{
		items?: TSelectItem[];
		label?: string;
	}>(),
	{
		items: () => [],
		label: "",
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

	floatingStyles.value = { transform: `translateX(${offsetLeft}px)`, width: `${offsetWidth}px` };
	value.value = val;

	wrapper.value?.scrollTo({ behavior: "smooth", left: offsetLeft });
};

const setDefaultValue = async () => {
	await nextTick();

	const el = group.value?.find((i) => i.dataset.value === value.value);
	if (el) setValue(el.dataset.value ?? "", el);
};

onMounted(async () => {
	await setDefaultValue();
	window.addEventListener("resize", setDefaultValue);
});

onUnmounted(() => {
	window.removeEventListener("resize", setDefaultValue);
});

// отдаем наверх функцию для обновления активного элемента.
// при появлении, например в модалке, размеры и позиция активного элемента равны 0
defineExpose({ setDefaultValue });
</script>
