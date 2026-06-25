export const useApi = () => {
	const isPending = ref(false);
	const errMessage = ref("");

	const controller = ref<AbortController | null>(null);

	const req = async <T>(url: string, options = {}) => {
		if (isPending.value && controller.value) controller.value.abort();

		controller.value = new AbortController();
		errMessage.value = "";
		isPending.value = true;

		try {
			const opts = { ...options, signal: controller.value.signal };
			const res = await $fetch<T>("/api" + url, opts);

			return res;
		} catch (err) {
			if (!(err instanceof Error) || err.name === "AbortController") return;

			errMessage.value = err.message;

			console.error(err);
		} finally {
			isPending.value = false;
		}
	};

	onUnmounted(() => controller.value?.abort());

	return { isPending, errMessage, req };
};
