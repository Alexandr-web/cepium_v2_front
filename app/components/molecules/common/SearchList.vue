<template>
	<div class="flex flex-col gap-6">
		<div class="flex items center gap-5">
			<h3
				v-if="label"
				class="text-12 lg:text-14 transition"
				:class="[
					error && 'text-secondary-500',
					!error && 'text-primary-700'
				]"
			>
				{{ label }}
			</h3>
			<p v-if="value.length" class="text-neutral-600 text-12 lg:text-14">({{ value.length }})</p>
		</div>
		<div class="flex flex-col gap-10">
			<AInput v-model="input" :placeholder="placeholder" preppend-icon="material-symbols:search-rounded" :disabled="disabled" />
			<div class="overflow-auto max-h-150 scroll-block">
				<div v-if="value.length" class="flex flex-wrap gap-10">
					<ATag
						v-for="(item, idx) in value"
						:key="idx"
						:label="item.label"
						@remove="removeItem(idx)"
					/>
				</div>
			</div>
			<div
				class="flex flex-col rounded-6 p-12 bg-primary-100 h-150 overflow-auto scroll-block relative"
				:class="[(!foundItems.length || isPending) && 'items-center justify-center']"
			>
				<IconLoader v-if="isPending" class="text-white absolute w-26 lg:w-36 h-26 lg:h-36" />
				<template v-else>
					<p v-if="!foundItems.length" class="text-14 text-neutral-500 text-center">{{ message }}</p>
					<ul v-else-if="foundItems.length && input.length" class="flex flex-col gap-5">
						<li
							v-for="(item, idx) in foundItems"
							:key="idx"
							class="text-neutral-800 text-14 rounded-6"
							:class="[
								hasItem(item) && 'bg-primary-200',
								!hasItem(item) && 'bg-primary-200/50'
							]"
						>
							<ARadio
								:model-value="hasItem(item)"
								:label="item.label"
								class="p-10"
								@update:model-value="addItem(item)"
							/>
						</li>
					</ul>
				</template>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import AInput from "@/components/atoms/AInput.vue";
import ARadio from "@/components/atoms/ARadio.vue";
import ATag from "@/components/atoms/ATag.vue";
import IconLoader from "@/assets/icons/loader.svg";

const { search, label = "", placeholder = "Поиск", disabled = false } = defineProps<{
	label?: string;
	placeholder?: string;
	disabled?: boolean;
	search: (value: string) => Promise<TSelectItem[]>;
}>();

const value = defineModel<TSelectItem[]>({ default: () => [] });
const error = defineModel<string>("error", { default: "" });

const isPending = ref(false);
const foundItems = ref<TSelectItem[]>([]);

const input = ref("");
const inputSearch = debouncedRef(input, 500);

const message = computed(() => {
	if (disabled) return "Недостаточно данных. Поиск невозможен";
	if (!foundItems.value.length) return "Ничего не найдено";
	return "";
});

watch(inputSearch, async (v) => {
	if (disabled) return;

	if (!v) {
		foundItems.value = [];
		return;
	}

	isPending.value = true;

	try {
		foundItems.value = await search(v);
	} catch (err) {
		console.error(err);
	} finally {
		isPending.value = false;
	}
});

const hasItem = (item: TSelectItem) => value.value.some((i) => i.value === item.value);
const removeItem = (idx: number) => idx !== -1 && value.value.splice(idx, 1);
const addItem = (item: TSelectItem) => {
	const itemIdx = value.value.findIndex((i) => i.value === item.value);
	if (itemIdx === -1) value.value.push(item);
	else removeItem(itemIdx);
};
</script>
