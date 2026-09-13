<template>
	<div class="flex flex-col rounded-8 max-w-full w-full min-w-0 overflow-hidden border border-solid border-white/5">
		<HeadTable v-if="headIcon || title || $slots['head-controls']" :title="title" :icon="headIcon">
			<slot name="head-controls" />
		</HeadTable>
		<div class="w-full overflow-x-auto relative">
			<table class="w-max min-w-full">
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
							<div
								class="flex items-center gap-5"
								:class="[
									(col.sort && sortedData.length) && 'cursor-pointer',
									col.key === sortKey && 'text-white',
								]"
								@click="setSort(col)"
							>
								{{ col.label }}
								<IconSort
									v-if="col.sort"
									class="w-14 h-14"
									:class="[
										(col.key === sortKey && sortOrder === 'asc') && 'rotate-x-180',
										(col.key === sortKey && sortOrder === 'desc') && 'rotate-x-0',
									]"
								/>
							</div>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if="!sortedData.length">
						<td :colspan="columns.length" class="p-32 text-14">
							<slot name="empty">
								<Empty />
							</slot>
						</td>
					</tr>
					<tr 
						v-for="(row, rowIndex) in sortedData" 
						:key="rowIndex"
						class="not-last:border-b-1 border-solid border-white/5 bg-neutral-100/80"
					>
						<!-- @vue-generic {T} -->
						<ColTable v-for="col in columns" :key="String(col.key)" :col="col" :row="row" :row-index="rowIndex">
							<template #[`cell-${String(col.key)}`]="values">
								<slot :name="`cell-${String(col.key)}`" v-bind="values" :index="rowIndex" />
							</template>
						</ColTable>
					</tr>
				</tbody>
			</table>
			<div v-if="isPending" class="absolute top-0 left-0 w-full h-full">
				<slot name="pending">
					<div class="bg-primary-200/60 flex justify-center items-center w-full h-full">
						<IconLoader class="w-30 h-30" />
					</div>
				</slot>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts" generic="T extends object">
import Empty from "@/components/molecules/common/Empty.vue";
import HeadTable from "@/components/molecules/table/Head.vue";
import ColTable from "@/components/molecules/table/Col.vue";
import IconSort from "@/assets/icons/sort-down-fill.svg";
import IconLoader from "@/assets/icons/loader.svg";

const props = withDefaults(
	defineProps<{
		data: T[];
		columns: TableColumn<T>[];
		title?: string;
		headIcon?: string;
		isPending?: boolean;
	}>(),
	{
		headIcon: "",
		title: "",
		isPending: false,
	}
);

const sortKey = ref<keyof T | string>("");
const sortOrder = ref<"asc" | "desc">("asc");

const order = computed(() => sortOrder.value === "asc" ? 1 : -1);

const sortedData = computed(() => {
	if (!sortKey.value) return props.data;

	return [...props.data].sort((a, b) => {
		if (hasKey(a, sortKey.value) && hasKey(b, sortKey.value)) {
			const aValue = a[sortKey.value];
			const bValue = b[sortKey.value];

			// сравнение строк
			if (typeof aValue === "string" && typeof bValue === "string") {
				return aValue.localeCompare(bValue) * order.value;
			}

			// сравнение чисел, дат и остальных типов
			if (aValue < bValue) return -1 * order.value;
			if (aValue > bValue) return 1 * order.value;

			return 0;
		}

		// если ключа нет в одном из объектов
		// объекты без ключа отправляем в самый конец таблицы
		if (hasKey(a, sortKey.value)) return -1;
		if (hasKey(b, sortKey.value)) return 1;
		
		return 0;
	});
});

const setSort = (col: TableColumn<T>) => {
	if (!col.sort || typeof col.key !== "string" || !props.data.length) return;

	if (col.key === sortKey.value) {
		sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
		return;
	}

	sortKey.value = col.key;
	sortOrder.value = "asc";
};
</script>
