<template>
	<nav class="flex items-center gap-40 lg:gap-0">
		<ul class="flex items-center gap-24">
			<li>
				<NuxtLink class="group flex justify-center items-center" :to="{ name: 'configs' }">
					<Icon name="material-symbols:settings-outline" class="text-primary-700 transition group-hover:text-primary-800 w-19 lg:w-22 h-19 lg:h-22" />
				</NuxtLink>
			</li>
			<li>
				<NuxtLink class="group flex justify-center items-center rounded-full w-30 lg:w-40 h-30 lg:h-40" :to="{ name: 'profile' }">
					<ClientOnly>
						<NuxtImg
							class="object-cover w-full h-full rounded-full"
							:src="userStore.avatar"
							:preload="{ fetchPriority: 'high' }"
							alt=""
						/>
					</ClientOnly>
				</NuxtLink>
			</li>
		</ul>
		<AButton
			class="w-20 h-20 text-primary-700 flex justify-center items-center lg:hidden"
			@click="showMenu = true"
		>
			<Icon name="material-symbols:menu-rounded" class="w-full h-full" />
		</AButton>
	</nav>
	<Teleport to="body">
		<Modal v-model="showMenu">
			<Menu @click-by-link="showMenu = false" />
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import { useUserStore } from "@/store/useUserStore";
import Modal from "@/components/molecules/common/Modal.vue";
import Menu from "@/components/molecules/layout/Menu.vue";
import AButton from "@/components/atoms/AButton.vue";

const userStore = useUserStore();

const showMenu = ref(false);
</script>
