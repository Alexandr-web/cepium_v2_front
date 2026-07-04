import { FetchError } from "ofetch";

export const useApi = () => {
	const isPending = ref(false);
	const errMessage = ref("");
	const controller = ref<AbortController | null>(null);

	const abort = () => controller.value?.abort();
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
			if (!(err instanceof FetchError) || err.name === "AbortController") return;

			const message = err.data.data.message;
			errMessage.value = !Array.isArray(message) ? message : message?.at(0) ?? "";

			console.error(err.message);
		} finally {
			isPending.value = false;
		}
	};

	onUnmounted(abort);

	return { isPending, errMessage, req, abort };
};
