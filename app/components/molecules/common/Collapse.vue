<template>
	<div class="flex flex-col rounded-8 border-1 border-solid border-neutral-300 bg-primary-100/50">
		<div class="flex items-center justify-between gap-10 cursor-pointer p-12" @click="isActive = !isActive">
			<div class="flex items-center gap-10">
				<component :is="iconsMap[preppendIcon]" v-if="preppendIcon" class="w-20 h-20 text-primary-600" />
				<h3 class="text-16 lg:text-18 text-neutral-800 select-none">{{ label }}</h3>
			</div>
			<IconKeyboardArrowDownRounded
				class="w-24 h-24 text-neutral-800"
				:class="[isActive && 'rotate-x-180']"
			/>
		</div>
		<div v-show="isActive" class="p-12 pt-0 grow">
			<slot />
		</div>
	</div>
</template>
<script setup lang="ts">
import IconPersonEditOutlineRounded from "@/assets/icons/person-edit-outline-rounded.svg";
import IconLockOutline from "@/assets/icons/lock-outline.svg";
import IconKeyboardArrowDownRounded from "@/assets/icons/keyboard-arrow-down-rounded.svg";

const { isOpen = false, preppendIcon = "" } = defineProps<{
	isOpen?: boolean;
	label: string;
	preppendIcon?: string;
}>();

const iconsMap: Record<string, string> = {
	"person-edit-outline-rounded": IconPersonEditOutlineRounded,
	"lock-outline": IconLockOutline,
};

const isActive = ref(isOpen);
</script>
