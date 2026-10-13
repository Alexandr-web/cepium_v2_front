<template>
	<nav class="flex items-center gap-12 lg:gap-0">
		<NuxtLink 
			class="group flex justify-center items-center rounded-full p-2 border border-solid border-neutral-200 hover:border-primary-400 bg-neutral-400 transition w-32 lg:w-36 h-32 lg:h-36" 
			:to="{ name: 'profile' }"
		>
			<div class="w-full h-full rounded-full overflow-hidden">
				<AImage
					:src="userStore.avatar"
					:preset="ImagePreset.AVATAR"
					fetchpriority="high"
					:alt="userStore.user.name ?? ''"
				/>
			</div>
		</NuxtLink>
		<AButton
			class="w-32 h-32 text-neutral-600 hover:text-neutral-900 flex justify-center items-center lg:hidden rounded-8 hover:bg-neutral-200/50 transition-colors"
			@click="showMobMenu = true"
		>
			<IconMenuRounded class="w-22 h-22" />
		</AButton>
	</nav>
	<Teleport to="body">
		<Modal v-model="showMobMenu">
			<Menu />
		</Modal>
	</Teleport>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
import Modal from "@/components/molecules/common/Modal.vue";
import Menu from "@/components/molecules/layout/Menu.vue";
import AImage from "@/components/atoms/AImage.vue";
import AButton from "@/components/atoms/AButton.vue";
import IconMenuRounded from "@/assets/icons/menu-rounded.svg";

const showMobMenu = useState("show-mob-menu", () => false);
const userStore = useUserStore();
</script>
