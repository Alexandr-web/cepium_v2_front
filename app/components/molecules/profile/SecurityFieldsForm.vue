<template>
	<form
		class="flex flex-col rounded-12 border border-solid border-neutral-100 bg-black/80 p-20 gap-16"
		@submit.prevent="requestChangePassword"
	>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
			<AInput
				v-model="fields.oldPassword.value"
				v-model:error="fields.oldPassword.error"
				placeholder="Пароль"
				label="Старый пароль"
				type="password"
			/>
			<AInput
				v-model="fields.newPassword.value"
				v-model:error="fields.newPassword.error"
				placeholder="Пароль"
				label="Новый пароль"
				type="password"
			/>
		</div>
		<div class="flex flex-col-reverse lg:flex-row lg:items-center gap-10">
			<AError v-if="!showModal" :message="errChangePasswordMessage" />
			<AButton
				class="w-full lg:w-auto rounded-4 py-10 px-24 lg:ml-auto"
				:mode="ButtonMode.PRIMARY_FILL"
				type="submit"
				:disabled="isPendingChangePassword"
			>
				Изменить
			</AButton>
		</div>
	</form>
	<Teleport to="body">
		<Modal v-model="showModal" :disabled="isPendingConfirmCode" size="small">
			<ConfirmCode
				ref="confirmCodeRef"
				v-model="confirmCode"
				v-model:error="errConfirmCodeMessage"
				title="Подтверждение изменения"
				send-text-btn="Изменить"
				cancel-text-btn="Отмена"
				:code-len="6"
				:disabled-btn="isPendingConfirmCode"
				@cancel="showModal = false"
				@send-code-again="requestChangePassword"
				@submit="requestConfirmCode"
			>
				<template #subtitle>
					<p class="text-14 lg:text-16 text-neutral-600">Мы отправили 6-значный код на вашу почту <span class="text-primary-700">{{ userStore.user.email }}</span></p>
				</template>
			</ConfirmCode>
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import * as z from "zod";
import { useUserStore } from "@/store/useUserStore";
import Modal from "@/components/molecules/common/Modal.vue";
import AButton from "@/components/atoms/AButton.vue";
import AInput from "@/components/atoms/AInput.vue";
import AError from "@/components/atoms/AError.vue";
import ConfirmCode from "@/components/molecules/common/ConfirmCode.vue";

import { useChangePassword, useConfirmChangePassword } from "@/composables/api/useUser";

const userStore = useUserStore();

const confirmCodeRef = ref<InstanceType<typeof ConfirmCode> | null>(null);
const confirmCode = ref("");

const showModal = ref(false);

const {
	isPending: isPendingChangePassword,
	mutate: sendChangePassword,
	errMessage: errChangePasswordMessage,
} = useChangePassword(() => showModal.value = true);

const {
	isPending: isPendingConfirmCode,
	mutate: sendConfirmChangePassword,
	errMessage: errConfirmCodeMessage,
} = useConfirmChangePassword(() => showModal.value = false);

const { fields, validate } = useFormState({
	oldPassword: { value: "", error: "", check: z.string().min(6) },
	newPassword: { value: "", error: "", check: z.string().min(6) },
});

const values = computed<UserEditSecurityData>(() => ({
	oldPassword: fields.oldPassword.value,
	newPassword: fields.newPassword.value,
}));

// запрашиваем код на почту
const requestChangePassword = () => {
	errChangePasswordMessage.value = "";
	errConfirmCodeMessage.value = "";
	if (validate()) sendChangePassword(values.value);
};

// подтверждаем присланный код
const requestConfirmCode = () => {
	errConfirmCodeMessage.value = "";
	sendConfirmChangePassword({ code: confirmCode.value });
};

watch(showModal, (v) => {
	if (!v) confirmCodeRef.value?.reset();
	else confirmCodeRef.value?.startTimer();
});
</script>
