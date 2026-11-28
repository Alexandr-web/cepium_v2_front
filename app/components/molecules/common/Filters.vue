<template>
	<div class="flex flex-col gap-24">
		<div class="items-center justify-between gap-10" :class="[title && 'flex', !title && 'flex lg:hidden']">
			<h2 v-if="title" class="text-20 lg:text-24 font-semibold">{{ title }}</h2>
			<AButton
				class="flex lg:hidden items-center justify-center p-8 rounded-8 border border-solid border-neutral-300"
				:mode="ButtonMode.NEUTRAL_FILL"
				:disabled="disabled"
				@click="showMobFilters = true"
			>
				<IconFilter class="w-22 h-22 text-white/50" />
			</AButton>
		</div>
		<div class="hidden lg:flex flex-row gap-20 flex-wrap" :class="filterClasses">
			<component
				:is="filter.component"
				v-for="(filter, idx) in filters"
				:key="idx"
				v-model="filter.value"
				:label="filter.label"
				:items="filter.items"
				:disabled="disabled"
				:class="filter.classes"
				label-classes="lg:text-16"
			/>
		</div>
	</div>
	<Teleport to="body">
		<Modal v-model="showMobFilters">
			<div class="scroll-block max-h-450 overflow-auto">
				<div class="flex lg:hidden flex-col gap-20">
					<component
						:is="filter.component"
						v-for="(filter, idx) in filters"
						:key="idx"
						v-model="filter.value"
						:label="filter.label"
						:items="filter.items"
						:disabled="disabled"
						:class="filter.classes"
						label-classes="lg:text-16"
					/>
				</div>
			</div>
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import IconFilter from "@/assets/icons/filter-big.svg";

withDefaults(
	defineProps<{
		disabled?: boolean;
		filters: FilterItem[];
		filterClasses?: string | string[];
		title?: string;
	}>(),
	{
		disabled: false,
		filterClasses: "",
		title: "",
	}
);

const showMobFilters = ref(false);
</script>
