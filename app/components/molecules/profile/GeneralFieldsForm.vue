<template>
	<!-- @vue-generic {TUserEditGeneralData}-->
	<GeneralForm
		:fields="inputFields"
		:normalized-data="normalizedData"
		mode="user"
		@send="(data: TUserEditGeneralData) => validateFields() && sendChangeData(data)"
	>
		<template #content>
			<div class="flex flex-col-reverse lg:flex-row">
				<AError :message="errMessage" />
				<AButton
					class="w-full lg:w-auto rounded-4 p-16 lg:px-24 lg:ml-auto"
					mode="primary-fill"
					:disabled="isPending"
					type="submit"
				>
					Сохранить изменения
				</AButton>
			</div>
		</template>
	</GeneralForm>
</template>
<script setup lang="ts">
import type { TUserEditGeneralData } from "@/types/api";
import type { TGeneralFormField } from "@/types/components";
import { useChangeData } from "@/composables/api/useUser";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import AButton from "@/components/atoms/AButton.vue";
import AError from "@/components/atoms/AError.vue";

const { fields } = defineProps<{
	fields: TGeneralFormField[];
	normalizedData: (fields: TGeneralFormField[]) => TUserEditGeneralData;
}>();

const { isPending, errMessage, mutate: sendChangeData } = useChangeData();
const { validateFields } = useForm(fields);

const inputFields = computed(() => fields.filter(({ name }) => ["email", "name"].includes(name)));
</script>
