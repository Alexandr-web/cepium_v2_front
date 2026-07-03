<template>
	<!-- @vue-generic {TUserEditSecurityData}-->
	<GeneralForm
		:fields="fields"
		:normalized-data="normalizedData"
		mode="user"
		@send="submit"
	>
		<template #content>
			<AButton
				class="w-full lg:w-auto rounded-4 p-16 lg:py-8 lg:px-24 lg:h-46 lg:ml-auto"
				mode="primary-fill"
				type="submit"
				:disabled="isPending"
			>
				Изменить
			</AButton>
		</template>
	</GeneralForm>
	<Teleport to="body">
		<Modal v-model="showModal" size="small">
			<ConfirmCode
				ref="confirmCodeRef"
				v-model="confirmCode"
				:code-len="6"
				title="Подтверждение изменения"
				send-text-btn="Изменить"
				cancel-text-btn="Отмена"
				@cancel="showModal = false"
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
import ConfirmCode from "@/components/molecules/common/ConfirmCode.vue";

const { fields } = defineProps<{
	fields: TGeneralFormField[];
	normalizedData: (fields: TGeneralFormField[]) => TUserEditSecurityData;
}>();

const userStore = useUserStore();
const authStore = useAuthStore();

const { isPending, errMessage, req } = useApi();

const confirmCodeRef = ref<InstanceType<typeof ConfirmCode> | null>(null);
const confirmCode = ref("");
const showModal = ref(false);

// валидация полей
const validateFields = () => {
	fields.forEach((field) => {
		field.error = !field.check ? "" : (field.check.safeParse(field.value).error?.message ?? "");
	});

	return fields.every(({ error }) => !error);
};

const submit = async (data: TUserEditSecurityData) => {
	if (!validateFields()) return;

	await req("/users/me/password/confirm-change", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${authStore.token ?? ""}`,
		},
		body: data,
	});

	if (errMessage.value) return;

	showModal.value = true;
};

watch(showModal, (v) => {
	if (!v) confirmCodeRef.value?.reset();
	else confirmCodeRef.value?.startTimer();
});
</script>
