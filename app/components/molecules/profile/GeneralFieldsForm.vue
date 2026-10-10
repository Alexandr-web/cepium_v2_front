<template>
	<form
		class="flex flex-col rounded-12 border border-solid border-neutral-100 bg-black/80 p-20 gap-16"
		@submit.prevent="validate() && sendChangeData(values)"
	>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
			<AInput
				v-model="fields.email.value"
				v-model:error="fields.email.error"
				placeholder="Эл. почта"
				label="Эл. почта"
			/>
			<AInput
				v-model="fields.name.value"
				v-model:error="fields.name.error"
				placeholder="Имя"
				label="Имя"
			/>
		</div>
		<div class="flex flex-col-reverse lg:flex-row">
			<AError :message="errMessage" />
			<AButton
				class="w-full lg:w-auto rounded-4 py-10 px-24 lg:ml-auto"
				:mode="ButtonMode.PRIMARY_FILL"
				:disabled="isPending"
				type="submit"
			>
				Сохранить изменения
			</AButton>
		</div>
	</form>
</template>
<script setup lang="ts">
import * as z from "zod";
import { useChangeData } from "@/composables/api/useUser";
import { useUserStore } from "@/store/useUserStore";
import AButton from "@/components/atoms/AButton.vue";
import AInput from "@/components/atoms/AInput.vue";
import AError from "@/components/atoms/AError.vue";

const props = defineProps<{
	avatar: File | string | null;
}>();

const userStore = useUserStore();

const { isPending, errMessage, mutate: sendChangeData } = useChangeData();

const { fields, validate } = useFormState({
	email: { value: userStore.user?.email ?? "", error: "", check: z.email() },
	name: { value: userStore.user?.name ?? "", error: "", check: z.string().min(1) },
});

const values = computed<UserEditGeneralData>(() => ({
	avatar: props.avatar instanceof File ? props.avatar : undefined,
	email: fields.email.value,
	name: fields.name.value,
}));
</script>
