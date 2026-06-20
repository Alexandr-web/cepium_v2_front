<template>
	<div class="flex flex-col my-auto gap-40 p-24">
		<div class="mx-auto inline-flex items-center flex-col gap-8">
			<div class="w-48 h-48 flex justify-center items-center rounded-12 border-primary-800/20 border-solid border-1 bg-primary-800/10">
				<LogoIcon class="w-25 h-17 text-primary-500" />
			</div>
			<Logo />
		</div>
		<GeneralForm :fields="fields">
			<template #footer>
				<p class="text-neutral-300 text-12 text-right">{{ VERSION }}</p>
			</template>
		</GeneralForm>
	</div>
</template>
<script setup lang="ts">
import type { TGeneralFormInput } from "@/types/components";
import { VERSION } from "#imports";
import LogoIcon from "@/assets/icons/logo.svg";
import Logo from "@/components/atoms/Logo.vue";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";

const fields = ref<TGeneralFormInput[]>([
	{
		value: "",
		placeholder: "Логин",
		name: "login",
		label: "Логин",
		preppendIcon: "teenyicons:user-circle-solid",
	},
	{
		value: "",
		placeholder: "Пароль",
		name: "password",
		type: "password",
		label: "Пароль",
		preppendIcon: "teenyicons:password-outline",
	},
]);
</script>
