<template>
	<!-- @vue-generic {TUserEditSecurityData}-->
	<GeneralForm
		:fields="fields"
		:normalized-data="normalizedData"
		mode="user"
		@send="requestChangePassword"
	>
		<template #content>
			<div class="flex flex-col-reverse lg:flex-row lg:items-center gap-10">
				<AError :message="errChangePasswordMessage" />
				<AButton
					class="w-full lg:w-auto rounded-4 p-16 lg:py-8 lg:px-24 lg:h-46 lg:ml-auto"
					mode="primary-fill"
					type="submit"
					:disabled="isPendingChangePassword"
				>
					Изменить
				</AButton>
			</div>
		</template>
	</GeneralForm>
	<Teleport to="body">
		<Modal v-model="showModal" size="small">
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
				@send-code-again="requestChangePassword(normalizedData(fields))"
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
import type { TGeneralFormField } from "@/types/components";
import type { TUserEditSecurityData } from "@/types/api";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import AButton from "@/components/atoms/AButton.vue";
import AError from "@/components/atoms/AError.vue";
import ConfirmCode from "@/components/molecules/common/ConfirmCode.vue";

const { fields } = defineProps<{
	fields: TGeneralFormField[];
	normalizedData: (fields: TGeneralFormField[]) => TUserEditSecurityData;
}>();

const emits = defineEmits(["success"]);

const userStore = useUserStore();
const authStore = useAuthStore();

const { validateFields } = useForm(fields);
const { isPending: isPendingChangePassword, errMessage: errChangePasswordMessage, req: reqChangePassword } = useApi();
const { isPending: isPendingConfirmCode, errMessage: errConfirmCodeMessage, req: reqConfirmCode } = useApi();

const confirmCodeRef = ref<InstanceType<typeof ConfirmCode> | null>(null);
const confirmCode = ref("");

const showModal = ref(false);

// запрашиваем код на почту
const requestChangePassword = async (data: TUserEditSecurityData) => {
	errConfirmCodeMessage.value = "";

	if (!validateFields()) return;

	await reqChangePassword("/users/me/password/request-change", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authStore.token ?? ""}`,
		},
		body: data,
	});

	if (errChangePasswordMessage.value) return;

	showModal.value = true;
};

// подтверждаем присланный код
const requestConfirmCode = async () => {
	await reqConfirmCode("/users/me/password/confirm-change", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authStore.token ?? ""}`,
		},
		body: { code: confirmCode.value },
	});

	if (errConfirmCodeMessage.value) return;

	showModal.value = false;

	emits("success");
};

watch(showModal, (v) => {
	if (!v) confirmCodeRef.value?.reset();
	else confirmCodeRef.value?.startTimer();
});
</script>
