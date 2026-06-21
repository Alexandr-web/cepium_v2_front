<template>
	<header class="flex items-center justify-between bg-neutral-100/50 h-64 border-1 border-solid border-b-white/5 p-16">
		<Logo />
		<div class="flex items-center lg:gap-24">
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
