<template>
	<div class="flex flex-col gap-8" :class="[disabled && 'opacity-50']">
		<h3 class="text-12 font-semibold tracking-wider uppercase text-neutral-500">{{ label }}</h3>
		<div 
			ref="wrapper" 
			class="flex scroll-block scroll-block--without-controls overflow-auto w-min max-w-full min-w-0 bg-neutral-200 p-4 rounded-10 mx-auto lg:mx-0 shadow-inner"
		>
			<ul class="flex items-center relative z-1 w-max">
				<div
					class="transition-all cubic-bezier(0.4, 0, 0.2, 1) absolute -z-1 top-0 left-0 bg-primary-400 rounded-8 h-full min-h-0 shadow-sm shadow-primary-500/10"
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
	setDefaultValue: (targetValue?: string) => Promise<void>;
};

defineOptions({ name: "ButtonGroup" });

const value = defineModel<string>({ default: "" });
const floatingStyles = ref({});

const wrapper = useTemplateRef("wrapper");
const group = useTemplateRef("group");

/**
 * Позиционирует "бегунок" (floating background) под конкретный <li> и
 * синхронизирует v-model.
 *
 * ВАЖНО: offsetLeft/offsetWidth читаются из реального DOM-элемента.
 * Если wrapper в момент вызова скрыт через display:none (например,
 * находится в неактивной desktop/mobile ветке разметки), оба значения
 * будут равны 0, и бегунок схлопнется в левый край с нулевой шириной,
 * хотя value.value при этом обновится корректно.
 *
 * @param val - value выбранного пункта (из data-value)
 * @param el - DOM-элемент <li>, на который кликнули / который нашли программно
 */
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

/**
 * Программно выставляет активное значение и пересчитывает позицию бегунка.
 *
 * Принимает targetValue ЯВНО, а не читает value.value изнутри.
 * Это принципиально: родительский компонент (Filters.vue) может обновить
 * массив filters (v-model) и почти сразу же дёрнуть этот метод - но само
 * обновление defineModel-пропа до дочернего компонента может долететь на
 * один тик позже, чем ожидается. Если бы мы читали value.value здесь,
 * можно было бы найти элемент по УЖЕ УСТАРЕВШЕМУ значению (race condition).
 * Явный параметр убирает эту зависимость от порядка реактивных обновлений.
 *
 * @param targetValue - значение, на которое нужно встать. Если не передано,
 *   используется текущее value.value (fallback для случаев без race,
 *   например ручного onMounted).
 */
const setDefaultValue = async (targetValue?: string) => {
	await nextTick();
	const target = targetValue ?? value.value;
	const el = group.value?.find((i) => i.dataset.value === target);
	if (el) setValue(el.dataset.value ?? "", el);
};

// Следим за изменением размеров контейнера через ResizeObserver.
// Это решает проблему нулевых размеров внутри модалок при их открытии.
//
// Колбэк ResizeObserver вызывается с массивом ResizeObserverEntry, поэтому
// сюда НЕЛЬЗЯ передавать setDefaultValue напрямую (иначе entries попадёт
// в параметр targetValue и сломает поиск элемента) - оборачиваем в стрелку
// без аргументов, чтобы использовался fallback на value.value.
if (import.meta.client) useResizeObserver(wrapper, () => setDefaultValue());

onMounted(setDefaultValue);

defineExpose({ setDefaultValue });
</script>
