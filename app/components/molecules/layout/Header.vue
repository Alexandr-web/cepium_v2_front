<template>
	<header class="flex items-center justify-between bg-neutral-100/60 h-64 border-b border-solid border-b-neutral-300/60 py-16 px-16 lg:px-24">
		<Logo :to="{ name: 'home' }" />
		<div class="flex items-center gap-12 lg:gap-24">
			<Connection class="hidden lg:flex" />
			<Menu />
		</div>
	</header>
</template>

<script setup lang="ts">
import Logo from "@/components/atoms/Logo.vue";
import Menu from "@/components/molecules/layout/HeaderMenu.vue";
import Connection from "@/components/atoms/Connection.vue";
</script>
