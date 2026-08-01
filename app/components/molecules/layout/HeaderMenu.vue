<template>
	<nav class="flex items-center gap-20 lg:gap-0">
		<ul class="flex items-center gap-16 lg:gap-0">
			<li class="lg:hidden">
				<NuxtLink 
					class="group flex justify-center items-center p-8 bg-neutral-200 rounded-8 hover:bg-neutral-300/50 transition-colors" 
					:to="{ name: 'configs' }"
				>
					<IconSettingsOutline class="text-neutral-500 transition-colors group-hover:text-neutral-900 w-20 h-20" />
				</NuxtLink>
			</li>
			<li>
				<NuxtLink 
					class="group flex justify-center items-center rounded-full p-2 border border-solid border-neutral-200 hover:border-primary-400 bg-neutral-400 transition w-32 lg:w-36 h-32 lg:h-36" 
					:to="{ name: 'profile' }"
				>
					<div class="w-full h-full rounded-full overflow-hidden">
						<NuxtImg
							class="object-cover w-full h-full"
							:src="userStore.avatar"
							:preload="{ fetchPriority: 'high' }"
							:alt="userStore.user.name"
						/>
					</div>
				</NuxtLink>
			</li>
		</ul>
		<AButton
			class="w-32 h-32 text-neutral-600 hover:text-neutral-900 flex justify-center items-center lg:hidden ml-12 rounded-8 hover:bg-neutral-200/50 transition-colors"
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
import AButton from "@/components/atoms/AButton.vue";
import IconSettingsOutline from "@/assets/icons/settings-outline.svg";
import IconMenuRounded from "@/assets/icons/menu-rounded.svg";

const showMobMenu = useState("show-mob-menu", () => false);
const userStore = useUserStore();
</script>
