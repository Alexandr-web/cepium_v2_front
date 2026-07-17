<template>
	<div class="flex flex-col rounded-8 overflow-hidden border-1 border-solid border-white/5">
		<div class="flex items-center justify-between h-65 p-24 bg-neutral-100">
			<div v-if="headIcon || title" class="flex items-center gap-8">
				<Icon v-if="headIcon" :name="headIcon" class="text-primary-800 w-18 h-18" />
				<h2 v-if="title" class="text-20 font-semibold leading-[1.2] text-neutral-800">{{ title }}</h2>
			</div>
			<slot name="head-controls" />
		</div>
		<table class="w-full">
			<thead>
				<tr class="border-b-1 border-solid border-white/5 bg-neutral-100/80">
					<th 
						v-for="col in columns" 
						:key="String(col.key)"
						class="p-24 text-12 text-neutral-700 uppercase truncate"
						:class="[
							!col.align && 'text-left',
							col.align === 'center' && 'text-center',
							col.align === 'right' && 'text-right',
						]"
					>
						{{ col.label }}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="!data.length">
					<td :colspan="columns.length" class="p-32 text-14">
						<slot name="empty">
							<div class="flex items-center justify-center gap-10">
								<Icon name="material-symbols:sentiment-sad-outline-rounded" class="text-neutral-800 w-20 h-20" />
								<p>Данные отсутствуют</p>
							</div>
						</slot>
					</td>
				</tr>
				<tr 
					v-for="(row, rowIndex) in data" 
					:key="rowIndex"
					class="not-last:border-b-1 border-solid border-white/5 bg-neutral-100/80"
				>
					<td 
						v-for="col in columns" 
						:key="String(col.key)"
						class="p-24 text-14 text-neutral-950 vertical-middle"
						:class="[
							col.align === 'center' && 'text-center',
							col.align === 'right' && 'text-right',
						]"
					>
						<slot 
							:name="`cell-${String(col.key)}`" 
							:row="row" 
							:v-bind="{ row, index: rowIndex, }"
							:index="rowIndex"
						>
							{{ getCellValue(row, col.key) }}
						</slot>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script setup lang="ts" generic="T extends object">
defineProps<{
	data: T[];
	columns: TTableColumn<T>[];
	title?: string;
	headIcon?: string;
}>();

/**
 * Безопасно извлекает значение из объекта строки по указанному ключу колонки.
 * 
 * @template T - Тип объекта данных строки, расширяющий базовый `object`.
 * 
 * @param {T} row - Объект данных текущей строки таблицы.
 * @param {keyof T | "actions"} key - Ключ колонки (свойство объекта `T` или кастомный строковый идентификатор).
 * 
 * @returns {"" | T[keyof T]} Значение свойства, если ключ существует в объекте; в противном случае — пустую строку.
 * 
 * @example
 * // Для существующего свойства:
 * getCellValue({ id: 1, pair: 'BTC/USDT' }, 'pair') // Выведет: 'BTC/USDT'
 * 
 * // Для кастомной колонки (например, кнопок действий):
 * getCellValue({ id: 1, pair: 'BTC/USDT' }, 'actions') // Выведет: ''
 */
const getCellValue = (row: T, key: TTableColumn<T>["key"]) => {
	if (key in row) return row[key as keyof T];
	return "";
};
</script>
