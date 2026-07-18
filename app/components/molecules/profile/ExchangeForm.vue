<template>
	<!-- @vue-generic {TExchangeCredentials}-->
	<GeneralForm
		:fields="fields"
		:normalized-data="normalizedData"
		mode="grid"
		@send="(data: TExchangeCredentials) => validateFields()"
	>
		<template #content>
			<div class="flex flex-col-reverse lg:flex-row">
				<AError message="" />
				<AButton
					class="w-full lg:w-auto rounded-4 p-16 lg:px-24 lg:ml-auto"
					mode="primary-fill"
					type="submit"
				>
					Сохранить изменения
				</AButton>
			</div>
		</template>
	</GeneralForm>
</template>
<script setup lang="ts">
import * as z from "zod";
import type Exchange from "@/models/Exchange";
import AError from "@/components/atoms/AError.vue";
import AButton from "@/components/atoms/AButton.vue";
import AInput from "@/components/atoms/AInput.vue";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";

defineProps<{
	exchange: Exchange|null;
	credentials?: TExchangeCredentialsResponse;
	isPending?: boolean;
}>();

const fields = ref<TGeneralFormField[]>([
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "API Ключ",
		name: "apiKey",
		label: "API Ключ",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
		type: "password",
	},
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "API Secret",
		name: "secretKey",
		label: "API Secret",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
		type: "password",
	},
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "Пароль",
		name: "password",
		label: "Пароль",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
		type: "password",
	},
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "UID",
		name: "uid",
		label: "UID",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
	},
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "Private Key",
		name: "privateKey",
		label: "Private Key",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
		type: "password",
	},
	{
		component: markRaw(AInput),
		value: "",
		placeholder: "Адрес кошелька",
		name: "walletAddress",
		label: "Адрес кошелька",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
	},
]);

const { validateFields } = useForm(fields);

const normalizedData = (): TExchangeCredentials => ({
	apiKey: "",
	secretKey: "",
	password: "",
	uid: "",
	privateKey: "",
	walletAddress: "",
});
</script>
