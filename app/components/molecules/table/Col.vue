<template>
	<td 
		class="p-24 text-14 text-neutral-950 vertical-middle"
		:class="classes"
	>
		<slot 
			:name="`cell-${String(col.key)}`" 
			v-bind="{ row, index: rowIndex, value: cellValue }"
			:index="rowIndex"
		>
			{{ cellValue }}
		</slot>
	</td>
</template>
<script setup lang="ts" generic="T extends object">
const props = defineProps<{
	col: TableColumn<T>;
	row: T;
	rowIndex: number;
}>();

const classes = computed(() => [
	props.col.align === "center" && "text-center",
	props.col.align === "right" && "text-right",
	props.col.classes instanceof Function ? props.col.classes(props.row) : props.col.classes,
]);

/**
 * Вычисляемое свойство для безопасного извлечения и форматирования значения ячейки.
 * 
 * Извлекает данные из объекта строки (`props.row`) по ключу колонки (`props.col.key`).
 * Обрабатывает системный ключ `'index'` и применяет функцию-нормализатор, если она передана.
 * 
 * @returns {any} Результат выполнения функции `props.col.normalizer` или исходное значение свойства.
 * Если ключ отсутствует в объекте строки и не является системным, возвращает пустую строку `""`.
 * 
 * @example
 * // Предположим, что в контексте компонента:
 * // props.rowIndex = 0
 * 
 * // 1. Извлечение индекса строки с нормализатором:
 * // props.col = { key: 'index', label: '№', normalizer: (v) => `${Number(v) + 1}.` }
 * // cellValue.value -> '1.'
 * 
 * // 2. Обычное извлечение из объекта строки без нормализатора:
 * // props.col = { key: 'pair', label: 'Пара' }
 * // props.row = { id: 1, pair: 'BTC/USDT' }
 * // cellValue.value -> 'BTC/USDT'
 * 
 * // 3. Извлечение с применением функции-нормализатора к значению из row:
 * // props.col = { key: 'price', label: 'Цена', normalizer: (val) => `${val} $` }
 * // props.row = { id: 1, price: 100 }
 * // cellValue.value -> '100 $'
 * 
 * // 4. Отсутствующий ключ в объекте row (например, колонка действий):
 * // props.col = { key: 'controls', label: 'Действия' }
 * // props.row = { id: 1, pair: 'BTC/USDT' }
 * // cellValue.value -> ''
 */
const cellValue = computed(() => {
	let val: string | number | T[keyof T] = "";
	if (props.col.key in props.row) val = props.row[props.col.key as keyof T];
	if (props.col.key === "index") val = props.rowIndex;

	return props.col.normalizer instanceof Function ? props.col.normalizer(val, props.row) : val;
});
</script>
