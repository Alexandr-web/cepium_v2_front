<template>
	<!-- @vue-generic {TExchangeCredentials}-->
	<GeneralForm
		:fields="fields"
		:normalized-data="normalizedData"
		mode="grid"
		@send="execute"
	>
		<template #content>
			<div class="flex flex-col-reverse lg:flex-row">
				<AError :message="errMessage" />
				<AButton
					class="w-full lg:w-auto rounded-4 p-16 lg:px-24 lg:ml-auto"
					mode="primary-fill"
					type="submit"
					:disabled="isPending"
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
import { useCreateData, useChangeData } from "@/composables/api/useCredentials";
import { useExchanges } from "@/composables/api/useExchanges";

const { exchange, credentials } = defineProps<{
	exchange: Exchange|null;
	credentials: TExchangeCredentialsResponse|undefined;
}>();

const emits = defineEmits(["success"]);

const { suspense: updateExchanges } = useExchanges();

const {
	mutate: createData,
	isPending: isPendingCreateData,
	errMessage: errCreateData,
} = useCreateData(
	() => exchange?.name ?? "",
	() => emits("success")
);

const {
	mutate: changeData,
	isPending: isPendingChangeData,
	errMessage: errChangeData,
} = useChangeData(
	() => exchange?.name ?? "",
	() => emits("success")
);

const errMessage = computed(() => errCreateData.value || errChangeData.value);
const isPending = computed(() => isPendingCreateData.value || isPendingChangeData.value);
const hasData = computed(() => !!credentials?.data);

const createFields = () => ([
	{
		component: markRaw(AInput),
		value: String(credentials?.data.apiKey ?? ""),
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
		value: String(credentials?.data.secretKey ?? ""),
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
		value: String(credentials?.data.password ?? ""),
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
		value: String(credentials?.data.uid ?? ""),
		placeholder: "UID",
		name: "uid",
		label: "UID",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
	},
	{
		component: markRaw(AInput),
		value: String(credentials?.data.privateKey ?? ""),
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
		value: String(credentials?.data.walletAddress ?? ""),
		placeholder: "Адрес кошелька",
		name: "walletAddress",
		label: "Адрес кошелька",
		preppendIcon: "",
		check: z.string().min(1),
		error: "",
		type: "password",
	},
]);

const fields = ref<TGeneralFormField[]>(createFields());

const { validateFields } = useForm(fields);

const normalizedData = (): TExchangeCredentials => ({
	apiKey: String(fields.value.find(({ name }) => name === "apiKey")?.value ?? ""),
	secretKey: String(fields.value.find(({ name }) => name === "secretKey")?.value ?? ""),
	password: String(fields.value.find(({ name }) => name === "password")?.value ?? ""),
	uid: String(fields.value.find(({ name }) => name === "uid")?.value ?? ""),
	privateKey: String(fields.value.find(({ name }) => name === "privateKey")?.value ?? ""),
	walletAddress: String(fields.value.find(({ name }) => name === "walletAddress")?.value ?? ""),
});

const execute = async (data: TExchangeCredentials) => {
	if (!validateFields() || isPending.value) return;
	
	if (!hasData.value) {
		createData(data);
		await updateExchanges();

		return;
	}

	changeData(data);
};

// обновляем fields при обновлении credentials
watch(() => credentials?.data, () => fields.value = createFields());
</script>
