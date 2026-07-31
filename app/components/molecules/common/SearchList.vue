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
			<p v-if="addedItems.length" class="text-neutral-600 text-12 lg:text-14">({{ addedItems.length }})</p>
		</div>
		<div class="flex flex-col gap-10">
			<AInput v-model="input" :placeholder="placeholder" preppend-icon="search-rounded" :disabled="disabled" />
			<div class="overflow-auto max-h-150 scroll-block">
				<div v-if="addedItems.length" class="grid lg:flex grid-cols-2 lg:flex-wrap gap-10">
					<ATag
						v-for="(item, idx) in addedItems"
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
					<ul v-else-if="foundItems.length && input.length" class="grid grid-cols-1 lg:grid-cols-3 gap-5">
						<li
							v-for="(item, idx) in foundItems"
							:key="idx"
							class="text-neutral-800 text-14 rounded-6"
							:class="[
								hasItem(item) && 'bg-primary-200',
								!hasItem(item) && 'bg-primary-200/50'
							]"
						>
							<ACheckbox
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
import ACheckbox from "@/components/atoms/ACheckbox.vue";
import ATag from "@/components/atoms/ATag.vue";
import IconLoader from "@/assets/icons/loader.svg";

const props = withDefaults(
	defineProps<{
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		search: (value: string) => Promise<TSelectItem[]>;
	}>(),
	{
		label: "",
		placeholder: "Поиск",
		disabled: false,
	}
);

const value = defineModel<string[]>({ default: () => [] });
const error = defineModel<string>("error", { default: "" });

const isPending = ref(false);
const foundItems = ref<TSelectItem[]>([]);
const addedItems = ref<TSelectItem[]>(value.value.map((v) => ({ label: v, value: v })));

const input = ref("");
const inputSearch = debouncedRef(input, 500);

const message = computed(() => {
	if (props.disabled) return "Недостаточно данных. Поиск невозможен";
	if (!foundItems.value.length) return "Ничего не найдено";
	return "";
});

watch(() => addedItems.value.length, () => {
	value.value = addedItems.value.map((i) => i.value);
});

watch(inputSearch, async (v) => {
	if (props.disabled) return;

	if (!v) {
		foundItems.value = [];
		return;
	}

	isPending.value = true;

	try {
		foundItems.value = await props.search(v);
	} catch (err) {
		console.error(err);
	} finally {
		isPending.value = false;
	}
});

const hasItem = (item: TSelectItem) => addedItems.value.some((i) => i.value === item.value);
const removeItem = (idx: number) => idx !== -1 && addedItems.value.splice(idx, 1);
const addItem = (item: TSelectItem) => {
	const itemIdx = addedItems.value.findIndex((i) => i.value === item.value);
	if (itemIdx === -1) addedItems.value.push(item);
	else removeItem(itemIdx);
};
</script>
