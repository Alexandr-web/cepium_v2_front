<template>
	<div class="flex flex-col rounded-8 max-w-full w-full min-w-0 overflow-hidden border border-solid border-white/5">
		<HeadTable v-if="headIcon || title || $slots['head-controls']" :title="title" :icon="headIcon">
			<slot name="head-controls" />
		</HeadTable>
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
							<Empty />
						</slot>
					</td>
				</tr>
				<tr 
					v-for="(row, rowIndex) in data" 
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
	</div>
</template>
<script setup lang="ts" generic="T extends object">
import Empty from "@/components/molecules/common/Empty.vue";
import HeadTable from "@/components/molecules/table/Head.vue";
import ColTable from "@/components/molecules/table/Col.vue";

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
</script>
