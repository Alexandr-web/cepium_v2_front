<template>
	<form
		class="flex flex-col rounded-12 border border-solid border-neutral-100 bg-black/80 p-20 gap-16"
		@submit.prevent="execute"
	>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
			<AInput
				v-model="fields.apiKey.value"
				v-model:error="fields.apiKey.error"
				placeholder="API Ключ"
				label="API Ключ"
				type="password"
			/>
			<AInput
				v-model="fields.secretKey.value"
				v-model:error="fields.secretKey.error"
				placeholder="API Secret"
				label="API Secret"
				type="password"
			/>
			<AInput
				v-model="fields.password.value"
				v-model:error="fields.password.error"
				placeholder="Пароль"
				label="Пароль"
				type="password"
			/>
			<AInput
				v-model="fields.uid.value"
				v-model:error="fields.uid.error"
				placeholder="UID"
				label="UID"
			/>
			<AInput
				v-model="fields.privateKey.value"
				v-model:error="fields.privateKey.error"
				placeholder="Private Key"
				label="Private Key"
				type="password"
			/>
			<AInput
				v-model="fields.walletAddress.value"
				v-model:error="fields.walletAddress.error"
				placeholder="Адрес кошелька"
				label="Адрес кошелька"
				type="password"
			/>
			<ACheckbox
				v-model="fields.demoTrading.value"
				label="Демо аккаунт"
				class="text-white/80"
				:size="CheckboxSize.BIG"
			/>
		</div>
		<div class="flex flex-col-reverse lg:flex-row">
			<AError :message="errMessage" />
			<AButton
				class="w-full lg:w-auto rounded-4 py-10 px-24 lg:ml-auto"
				:mode="ButtonMode.PRIMARY_FILL"
				type="submit"
				:disabled="isPending"
			>
				Сохранить изменения
			</AButton>
		</div>
	</form>
</template>
<script setup lang="ts">
import * as z from "zod";
import AError from "@/components/atoms/AError.vue";
import AButton from "@/components/atoms/AButton.vue";
import AInput from "@/components/atoms/AInput.vue";
import ACheckbox from "@/components/atoms/ACheckbox.vue";
import { useCreateData, useChangeData } from "@/composables/api/useCredentials";
import { useExchanges } from "@/composables/api/useExchanges";

const props = withDefaults(
	defineProps<{
		exchange: ExchangeDto|null;
		credentials?: ExchangeCredentialsResponse;
	}>(),
	{
		credentials: undefined,
	}
);

const emits = defineEmits(["success"]);

const { suspense: updateExchanges } = useExchanges();

const {
	mutate: createData,
	isPending: isPendingCreateData,
	errMessage: errCreateData,
} = useCreateData(
	() => props.exchange?.name ?? "",
	() => emits("success")
);

const {
	mutate: changeData,
	isPending: isPendingChangeData,
	errMessage: errChangeData,
} = useChangeData(
	() => props.exchange?.name ?? "",
	() => emits("success")
);

const errMessage = computed(() => errCreateData.value || errChangeData.value);
const isPending = computed(() => isPendingCreateData.value || isPendingChangeData.value);

const { fields, validate, reset } = useFormState({
	apiKey: { value: String(props.credentials?.data.apiKey ?? ""), error: "", check: z.string().min(1) },
	secretKey: { value: String(props.credentials?.data.secretKey ?? ""), error: "", check: z.string().min(1) },
	password: { value: String(props.credentials?.data.password ?? ""), error: "" },
	uid: { value: String(props.credentials?.data.uid ?? ""), error: "" },
	privateKey: { value: String(props.credentials?.data.privateKey ?? ""), error: "" },
	walletAddress: { value: String(props.credentials?.data.walletAddress ?? ""), error: "" },
	demoTrading: { value: Boolean(props.credentials?.data.demoTrading ?? false), error: "" },
});

const values = computed<ExchangeCredentials>(() => ({
	apiKey: fields.apiKey.value,
	secretKey: fields.secretKey.value,
	password: fields.password.value,
	uid: fields.uid.value,
	privateKey: fields.privateKey.value,
	walletAddress: fields.walletAddress.value,
	demoTrading: fields.demoTrading.value,
}));

const execute = async () => {
	if (!validate() || isPending.value) return;

	if (!props.exchange?.filled) {
		createData(values.value);
		await updateExchanges();

		return;
	}

	changeData(values.value);
};

// обновляем значения полей при обновлении credentials
watch(
	() => props.credentials?.data,
	(v) => {
		fields.apiKey.value = String(v?.apiKey ?? "");
		fields.secretKey.value = String(v?.secretKey ?? "");
		fields.password.value = String(v?.password ?? "");
		fields.uid.value = String(v?.uid ?? "");
		fields.privateKey.value = String(v?.privateKey ?? "");
		fields.walletAddress.value = String(v?.walletAddress ?? "");
		fields.demoTrading.value = Boolean(v?.demoTrading ?? false);
	}
);

// сбрасываем форму при закрытии модалки
watch(
	() => props.exchange,
	(v) => !v && reset()
);
</script>
