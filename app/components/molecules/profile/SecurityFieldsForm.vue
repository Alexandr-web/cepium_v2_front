<template>
	<!-- @vue-generic {TUserEditSecurityData}-->
	<GeneralForm
		:fields="fields"
		:normalized-data="normalizedData"
		mode="compact"
		@send="showModal = true"
	>
		<template #content>
			<AButton class="w-full lg:w-1/5 rounded-4 p-16 lg:py-8 lg:px-24 lg:h-46 lg:mt-auto" mode="primary-fill" type="submit">
				Изменить
			</AButton>
		</template>
	</GeneralForm>
	<Teleport to="body">
		<Modal v-model="showModal">
			Hello
		</Modal>
	</Teleport>
</template>
<script setup lang="ts">
import type { TGeneralFormField } from "@/types/components";
import type { TUserEditSecurityData } from "@/types/api";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import Modal from "@/components/molecules/common/Modal.vue";
import AButton from "@/components/atoms/AButton.vue";

defineProps<{
	fields: TGeneralFormField[];
	normalizedData: (fields: TGeneralFormField[]) => TUserEditSecurityData;
}>();

const showModal = ref(false);
</script>
