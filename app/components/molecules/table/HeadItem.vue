<template>
	<th 
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
</template>
<script setup lang="ts" generic="T extends object">
import IconSort from "@/assets/icons/sort-down-fill.svg";

withDefaults(
	defineProps<{
		col: TableColumn<T>;
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
