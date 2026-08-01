<template>
	<div class="flex items-center gap-6 max-w-full w-full lg:w-auto lg:mx-auto select-none">
		<AButton
			:disabled="isFirstPage"
			class="flex items-center justify-center w-36 h-36"
			@click="prev"
		>
			<IconArrowDown class="w-20 h-20 rotate-90" />
		</AButton>

		<ul class="flex items-center justify-center gap-4 min-w-0 grow">
			<li v-for="(item, index) in pages" :key="`${item}-${index}`" class="flex items-center">
				<span
					v-if="item === SPACES_STRING"
					class="flex items-center justify-center w-36 h-36 text-12 text-neutral-500 tracking-widest"
				>
					{{ SPACES_STRING }}
				</span>
				
				<AButton
					v-else
					class="flex items-center justify-center w-36 h-36 rounded-8 text-12! transition tap"
					:mode="item === currentPage ? 'primary-border' : 'neutral-fill'"
					@click="currentPage = item"
				>
					{{ item }}
				</AButton>
			</li>
		</ul>

		<AButton
			:disabled="isLastPage"
			class="flex items-center justify-center w-36 h-36"
			@click="next"
		>
			<IconArrowDown class="w-20 h-20 -rotate-90" />
		</AButton>
	</div>
</template>

<script setup lang="ts">
import AButton from "@/components/atoms/AButton.vue";
import IconArrowDown from "@/assets/icons/keyboard-arrow-down-rounded.svg";

const props = withDefaults(
	defineProps<{
		total: number
		perPage?: number
		siblingCount?: number
	}>(),
	{
		perPage: 10,
		siblingCount: 1,
	}
);

const { isMobile } = useDevice();

const sibling = computed(() => isMobile ? 0 : props.siblingCount);

const SPACES_STRING = "...";

const currentPage = defineModel<number>("page", { default: 1 });

const { pageCount, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
	total: () => props.total,
	pageSize: () => props.perPage,
	page: currentPage,
});

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

const pages = computed<(number | typeof SPACES_STRING)[]>(() => {
	const total = pageCount.value;
	const current = currentPage.value;
	const totalVisible = sibling.value * 2 + 5;

	if (total <= totalVisible) return range(1, total);

	const leftSiblingIndex = Math.max(current - sibling.value, 1);
	const rightSiblingIndex = Math.min(current + sibling.value, total);

	const showLeftDots = leftSiblingIndex > 2;
	const showRightDots = rightSiblingIndex < total - 2;

	if (!showLeftDots && showRightDots) {
		const leftItemCount = 3 + sibling.value * 2;
		return [...range(1, leftItemCount), SPACES_STRING, total];
	}

	if (showLeftDots && !showRightDots) {
		const rightItemCount = 3 + sibling.value * 2;
		return [1, SPACES_STRING, ...range(total - rightItemCount + 1, total)];
	}

	return [1, SPACES_STRING, ...range(leftSiblingIndex, rightSiblingIndex), SPACES_STRING, total];
});
</script>
