<template>
	<section class="flex flex-col my-auto gap-40 p-24">
		<div class="mx-auto inline-flex items-center flex-col gap-8">
			<div class="w-48 lg:w-68 h-48 lg:h-68 flex justify-center items-center rounded-12 border-primary-800/20 border-solid border-1 bg-primary-800/10">
				<LogoIcon class="w-25 lg:w-30 h-17 lg:h-22 text-primary-500" />
			</div>
			<Logo />
		</div>
		<!-- @vue-generic {TAuthLoginData} -->
		<GeneralForm
			class="lg:max-w-420 lg:mx-auto lg:w-full"
			:fields="fields"
			:normalized-data="normalizedData"
			@send="login"
		>
			<template #content>
				<AButton
					class="group flex items-center justify-center gap-8 rounded-4 h-56 lg:mt-16"
					type="submit"
					mode="primary-fill"
					:disabled="disabledBtn"
				>
					<span class="uppercase text-primary-100 text-14 lg:text-16 font-medium">Войти</span>
					<Icon class="group-hover:translate-x-[50%] transition min-w-16 lg:min-w-18 max-w-16 lg:max-w-18 min-h-16 lg:min-h-18 max-h-16 lg:max-h-18 text-black" name="material-symbols:keyboard-double-arrow-right" />
				</AButton>
			</template>
			<template #footer>
				<div class="flex items-center">
					<p v-if="errMessage" class="text-secondary-500 text-14">{{ errMessage }}</p>
					<p class="text-neutral-300 text-12 lg:text-14 ml-auto">{{ VERSION }}</p>
				</div>
			</template>
		</GeneralForm>
	</section>
</template>
<script setup lang="ts">
import * as z from "zod";
import { useApi } from "@/composables/useApi";
import type { TGeneralFormField } from "@/types/components";
import type { TAuthLoginData, TAuthLoginResponse } from "@/types/api";
import { useAuthStore } from "@/store/useAuthStore";
import LogoIcon from "@/assets/icons/logo.svg";
import Logo from "@/components/atoms/Logo.vue";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import AInput from "@/components/atoms/AInput.vue";
import AButton from "@/components/atoms/AButton.vue";

const authStore = useAuthStore();

const router = useRouter();
const { isPending, errMessage, req } = useApi();

const fields = ref<TGeneralFormField[]>([
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "Эл. почта",
		name: "email",
		label: "Эл. почта",
		preppendIcon: "material-symbols:account-circle",
		check: z.email(),
		error: "",
	},
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "Пароль",
		name: "password",
		type: "password",
		label: "Пароль",
		preppendIcon: "material-symbols:lock-outline",
		check: z.string().min(6),
		error: "",
	},
]);

const hasInvalidFields = computed(() => fields.value.some(({ error }) => error));
const disabledBtn = computed(() => !!(isPending.value || hasInvalidFields.value));

// валидация всех полей
const validateFields = () => {
	fields.value.forEach((field) => {
		if (field.check) {
			field.error = field.check.safeParse(field.value).error?.message ?? "";
		}
	});

	return fields.value.every(({ error }) => !error);
};

// нормализация данных для отправки на бек
const normalizedData = (): TAuthLoginData => ({
	email: String(fields.value.find((f) => f.name === "email")?.value ?? ""),
	password: String(fields.value.find((f) => f.name === "password")?.value ?? ""),
});

const login = async (data: TAuthLoginData) => {
	if (!validateFields()) return;

	const res = await req<TAuthLoginResponse>("/auth/login", {
		method: "POST",
		body: data,
	});

	const token = res?.data?.token;

	if (token) {
		authStore.token = token;
		router.push({ name: "home" });
		return;
	}
};
</script>
