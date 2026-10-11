<template>
	<tr class="border-b-1 border-solid border-white/5 bg-black/90">
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
					(col.sort && !disabled) && 'cursor-pointer',
					col.key === sortKey && 'text-white',
				]"
				@click="emits('selectSort', col)"
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
</template>
<script setup lang="ts" generic="T extends object">
import IconSort from "@/assets/icons/sort-down-fill.svg";

withDefaults(
	defineProps<{
		columns: TableColumn<T>[];
		sortKey: keyof T | string;
		sortOrder: string;
		disabled?: boolean;
	}>(),
	{
		disabled: false,
	}
);

const emits = defineEmits(["selectSort"]);
</script>
