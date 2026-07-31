<template>
	<div class="flex flex-col rounded-8 overflow-hidden border-1 border-solid border-white/5">
		<div v-if="headIcon || title || $slots['head-controls']" class="flex items-center justify-between h-65 p-24 bg-neutral-100">
			<div v-if="headIcon || title" class="flex items-center gap-8">
				<component :is="iconsMap[headIcon]" v-if="headIcon" class="text-primary-800 w-18 h-18" />
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
								<IconSentimentSadOutlineRounded class="text-neutral-800 w-20 h-20" />
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
							v-bind="{ row, index: rowIndex, value: getCellValue(row, col, rowIndex) }"
							:index="rowIndex"
						>
							{{ getCellValue(row, col, rowIndex) }}
						</slot>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script setup lang="ts" generic="T extends object">
import IconSentimentSadOutlineRounded from "@/assets/icons/sentiment-sad-outline-rounded.svg";
import IconCardTravelOutlineRounded from "@/assets/icons/card-travel-outline-rounded.svg";
import IconViewList from "@/assets/icons/view-list.svg";

withDefaults(
	defineProps<{
		data: T[];
		columns: TTableColumn<T>[];
		title?: string;
		headIcon?: string;
	}>(),
	{
		headIcon: "",
		title: "",
	}
);

/**
 * Безопасно извлекает значение из объекта строки по ключу колонки, обрабатывает системные ключи и применяет нормализатор.
 * 
 * @template T - Тип объекта данных строки, расширяющий базовый `object`.
 * 
 * @param {T} row - Объект данных текущей строки таблицы.
 * @param {TTableColumn<T>} col - Объект конфигурации текущей колонки таблицы.
 * @param {number} index - Порядковый индекс текущей строки в массиве данных (используется для колонки "index").
 * 
 * @returns {any} Результат выполнения функции нормализатора, либо сырое значение свойства объекта `T`. 
 * Если ключ отсутствует в объекте строки и не является системным, возвращает пустую строку (или результат нормализатора для неё).
 * 
 * @example
 * // 1. Извлечение индекса строки с нормализатором:
 * // col = { key: 'index', label: '№', normalizer: (v) => `${Number(v) + 1}.` }
 * getCellValue({ id: 10, pair: 'BTC' }, col, 0) // Выведет: '1.'
 * 
 * // 2. Обычное извлечение без нормализатора:
 * // col = { key: 'pair', label: 'Пара' }
 * getCellValue({ id: 1, pair: 'BTC/USDT' }, col, 0) // Выведет: 'BTC/USDT'
 * 
 * // 3. Извлечение с применением функции-нормализатора:
 * // col = { key: 'price', label: 'Цена', normalizer: (val) => `${val} $` }
 * getCellValue({ id: 1, price: 100 }, col, 0) // Выведет: '100 $'
 * 
 * // 4. Для кастомной или пустой колонки (например, 'controls'):
 * // col = { key: 'controls', label: 'Действия' }
 * getCellValue({ id: 1, pair: 'BTC/USDT' }, col, 0) // Выведет: ''
 */
const getCellValue = (row: T, col: TTableColumn<T>, index: number) => {
	let val: string | number | T[keyof T] = "";
	if (col.key in row) val = row[col.key as keyof T];
	if (col.key === "index") val = index;

	return col.normalizer instanceof Function ? col.normalizer(val) : val;
};

const iconsMap: Record<string, string> = {
	"card-travel-outline-rounded": IconCardTravelOutlineRounded,
	"view-list": IconViewList,
};
</script>
