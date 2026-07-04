type TTimerOptions = {
  defaultTime?: number;
  mode?: "up" | "down";
}

export const useTimer = (limit: number, options: TTimerOptions = {}) => {
	const { defaultTime = 0, mode = "up" } = options;
	const currentTime = ref(defaultTime);
	const isOver = computed(() => 
		(mode === "down" && currentTime.value <= limit) ||
		(mode === "up" && currentTime.value >= limit)
	);

	let timer: NodeJS.Timeout | null = null;

	const start = () => timer = setInterval(setTimer, 1000);
	const stop = (clearCurrentTime?: boolean) => {
		if (timer) {
			clearInterval(timer);

			timer = null;
		}

		if (clearCurrentTime) currentTime.value = defaultTime;
	};

	const setTimer = () => {
		if (!timer) return;
		currentTime.value += mode === "down" ? -1000 : 1000;
	};

	watch(isOver, (v) => v && stop());

	onUnmounted(stop);

	return { currentTime, isOver, stop, start };
};
