<template>
	<section class="flex flex-col my-auto gap-40 p-24">
		<div class="mx-auto inline-flex items-center flex-col gap-8">
			<IconLogo class="w-auto h-40 lg:h-50 object-contain" />
		</div>
		<form
			class="flex flex-col rounded-12 lg:rounded-24 border border-solid border-white/10 bg-white/5 p-16 lg:p-24 gap-20 lg:max-w-420 lg:mx-auto lg:w-full"
			novalidate
			@submit.prevent="execute"
		>
			<div class="flex flex-col gap-10">
				<AInput
					v-model="fields.email.value"
					v-model:error="fields.email.error"
					placeholder="Эл. почта"
					label="Эл. почта"
					type="email"
					prepend-icon="account-circle"
				/>
				<AInput
					v-model="fields.password.value"
					v-model:error="fields.password.error"
					placeholder="Пароль"
					type="password"
					label="Пароль"
					prepend-icon="lock-outline"
				/>
			</div>
			<AButton
				class="group flex items-center justify-center gap-8 rounded-8 lg:mt-16 py-10 px-24"
				type="submit"
				:mode="ButtonMode.PRIMARY_BORDER"
				:disabled="isPending"
			>
				<span class="uppercase text-neutral-800 text-14 lg:text-16 font-medium">Войти</span>
				<IconKeyboardDoubleArrowRight class="group-hover:translate-x-[50%] transition min-w-16 lg:min-w-18 max-w-16 lg:max-w-18 min-h-16 lg:min-h-18 max-h-16 lg:max-h-18 text-neutral-800" />
			</AButton>
			<div class="flex items-center">
				<AError :message="errMessage" />
				<p class="text-neutral-500 text-12 lg:text-14 ml-auto">{{ VERSION }}</p>
			</div>
		</form>
	</section>
</template>
<script setup lang="ts">
import * as z from "zod";
import IconKeyboardDoubleArrowRight from "@/assets/icons/keyboard-double-arrow-right.svg";
import IconLogo from "@/assets/icons/logo.svg";
import AInput from "@/components/atoms/AInput.vue";
import AError from "@/components/atoms/AError.vue";
import AButton from "@/components/atoms/AButton.vue";

import { useLogin } from "@/composables/api/useAuth";

const { errMessage, mutateAsync: sendLogin, isPending } = useLogin();

const { fields, validate } = useFormState({
	email: { value: "", error: "", check: z.email() },
	password: { value: "", error: "", check: z.string().min(6) },
});

// нормализация данных для отправки на бек
const values = computed<AuthLoginData>(() => ({
	email: fields.email.value,
	password: fields.password.value,
}));

const execute = async () => {
	errMessage.value = "";
	if (validate()) await sendLogin(values.value);
};
</script>
