<template>
	<div class="flex flex-col gap-6">
		<LabelField v-model:error="error" :count="addedItemsMap.size" :label="label" :tooltip-text="tooltipText" />
		<div class="flex flex-col gap-10">
			<AInput v-model="input" :placeholder="placeholder" prepend-icon="search-rounded" :disabled="disabled" />
			<div class="overflow-auto max-h-150 scroll-block">
				<div v-if="addedItemsMap.size" class="grid lg:flex grid-cols-2 lg:flex-wrap gap-10">
					<ATag
						v-for="item in addedItemsMap.values()"
						:key="item.value"
						:label="item.label"
						:class="[!!itemClickHandler && 'hover:underline']"
						@remove="removeItem(item)"
						@click="itemClickHandler?.(item)"
					/>
				</div>
			</div>
			<div
				class="flex flex-col rounded-6 p-12 bg-primary-100 h-150 overflow-auto scroll-block relative"
				:class="[(!foundItemsMap.size || isPending) && 'items-center justify-center']"
			>
				<IconLoader v-if="isPending" class="text-white absolute w-26 lg:w-36 h-26 lg:h-36" />
				<template v-else>
					<p v-if="!foundItemsMap.size" class="text-14 text-neutral-500 text-center">{{ message }}</p>
					<ul v-else-if="foundItemsMap.size && input.length" class="grid grid-cols-1 lg:grid-cols-3 gap-5">
						<li
							v-for="item in foundItemsMap.values()"
							:key="item.value"
							class="text-neutral-800 text-14 rounded-6"
							:class="[
								addedItemsMap.has(item.value) && 'bg-primary-200',
								!addedItemsMap.has(item.value) && 'bg-primary-200/50'
							]"
						>
							<ACheckbox
								:model-value="addedItemsMap.has(item.value)"
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
import LabelField from "@/components/atoms/LabelField.vue";
import IconLoader from "@/assets/icons/loader.svg";
import type z from "zod";

const props = withDefaults(
	defineProps<{
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		tooltipText?: string;
		check?: z.ZodType;
		search: (value: string) => Promise<SelectItem[]>;
		itemClickHandler?: (item: SelectItem) => Promise<void>;
	}>(),
	{
		label: "",
		placeholder: "Поиск",
		tooltipText: "",
		disabled: false,
		itemClickHandler: undefined,
		check: undefined,
	}
);

const value = defineModel<string[]>({ default: () => [] });
const error = defineModel<string>("error", { default: "" });

const isPending = ref(false);
const foundItemsMap = ref<Map<string, SelectItem>>(new Map());

const checkValidMessage = computed(() => props.check?.safeParse(value.value)?.error?.message ?? "");
const addedItemsMap = computed<Map<string, SelectItem>>(() =>
	new Map(value.value.map((v) => ([v, { label: v, value: v }])))
);

const input = ref("");
const inputSearch = debouncedRef(input, 500);

const message = computed(() => {
	if (props.disabled) return "Недостаточно данных. Поиск невозможен";
	if (!foundItemsMap.value.size) return "Ничего не найдено";
	return "";
});

watch(() => value.value.length, (v) => error.value = !v ? "" : checkValidMessage.value);

watch(inputSearch, async (v) => {
	if (props.disabled) return;

	if (!v) {
		foundItemsMap.value.clear();
		return;
	}

	isPending.value = true;

	try {
		const res = await props.search(v);
		foundItemsMap.value = new Map(res.map((item) => [item.value, item]));
	} catch (err) {
		console.error(err);
	} finally {
		isPending.value = false;
	}
});

const addItem = (item: SelectItem) => {
	if (!addedItemsMap.value.has(item.value)) value.value.push(item.value);
	else removeItem(item);
};

const removeItem = (item: SelectItem) => {
	value.value = value.value.filter((s) => s !== item.value);
};
</script>
