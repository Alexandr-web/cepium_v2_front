<template>
	<!-- @vue-generic {UserEditGeneralData}-->
	<GeneralForm
		:fields="inputFields"
		:normalized-data="normalizedData"
		mode="grid"
		@send="(data: UserEditGeneralData) => validateFields() && sendChangeData(data)"
	>
		<template #content>
			<div class="flex flex-col-reverse lg:flex-row">
				<AError :message="errMessage" />
				<AButton
					class="w-full lg:w-auto rounded-4 py-10 px-24 lg:ml-auto"
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
import { useChangeData } from "@/composables/api/useUser";
import GeneralForm from "@/components/molecules/common/GeneralForm.vue";
import AButton from "@/components/atoms/AButton.vue";
import AError from "@/components/atoms/AError.vue";

const { fields } = defineProps<{
	fields: GeneralFormField[];
	normalizedData: (fields: GeneralFormField[]) => UserEditGeneralData;
}>();

const { isPending, errMessage, mutate: sendChangeData } = useChangeData();
const { validateFields } = useForm(fields);

const inputFields = computed(() => fields.filter(({ name }) => ["email", "name"].includes(name)));
</script>
