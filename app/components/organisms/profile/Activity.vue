<template>
	<div class="flex flex-col gap-8 w-full">
		<div class="flex items-center gap-6">
			<p class="text-neutral-700 text-12 lg:text-16">Меньше</p>
			<div class="flex items-center gap-3">
				<Tooltip
					v-for="i in colorClasses.length - 1"
					:key="i"
					:disabled="!isDesktop"
				>
					<template #trigger>
						<div
							class="w-10 lg:w-14 h-10 lg:h-14 rounded-3"
							:class="colorClasses[i]"
						/>
					</template>
					<template #content>
						{{ legendRanges[i] }}
					</template>
				</Tooltip>
			</div>
			<p class="text-neutral-700 text-12 lg:text-16">Больше</p>
		</div>
		<div class="w-full overflow-x-auto bg-neutral-200 p-12 rounded-8 border border-solid border-neutral-300">
			<table class="w-max lg:w-full border-separate border-spacing-2">
				<thead>
					<tr>
						<td />
						<td
							v-for="label in monthLabels"
							:key="label.colStart"
							:colspan="label.colSpan"
							class="text-12 text-neutral-600 pl-2"
						>
							{{ label.name }}
						</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(dayName, row) in WEEKDAY_LABELS" :key="dayName">
						<td class="text-12 text-neutral-600 pr-2">{{ dayName }}</td>
						<td v-for="(day, col) in rows[row]" :key="col">
							<Tooltip v-if="day" :disabled="!isDesktop" class="h-full">
								<template #trigger>
									<div
										class="w-14 lg:w-18 h-14 lg:h-18 rounded-2"
										:class="[colorClasses[day.level], day.date === today && 'border border-tertiary-400']"
									/>
								</template>
								<template #content>
									<div class="flex flex-col">
										<p>{{ day.formatDate }}</p>
										<span v-if="day.value" class="font-bold text-white">{{ day.value }}</span>
									</div>
								</template>
							</Tooltip>
							<div v-else class="w-14 lg:w-18 h-14 lg:h-18" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script setup lang="ts">
import Tooltip from "@/components/molecules/common/Tooltip.vue";

const props = withDefaults(
	defineProps<{
		activities?: ActivityItem[];
		year?: number;
	}>(),
	{
		activities: () => [],
		year: undefined,
	}
);

const isDesktop = useMediaQuery("(min-width: 1024px)");

// Верхние границы уровней 1-3; всё, что больше последней, - уровень 4.
const LEVEL_THRESHOLDS = [5, 10, 15] as const;

const colorClasses = [
	"bg-neutral-100",
	"bg-primary-300",
	"bg-primary-500",
	"bg-primary-700",
	"bg-primary-950",
];

const legendRanges = [
	"0",
	`1-${LEVEL_THRESHOLDS[0]}`,
	`${LEVEL_THRESHOLDS[0] + 1}-${LEVEL_THRESHOLDS[1]}`,
	`${LEVEL_THRESHOLDS[1] + 1}-${LEVEL_THRESHOLDS[2]}`,
	`${LEVEL_THRESHOLDS[2] + 1}+`,
];

// Дату на сервере считаем в UTC, после гидрации уточняем до локальной (см. onMounted).
const today = useState<string>("activity-today", () => new Date().toISOString().slice(0, 10));
const year = computed(() => props.year ?? Number(today.value.slice(0, 4)));

const activitiesMap = computed(
	() => new Map<string, number>(props.activities.map((i) => [i.date.slice(0, 10), i.value]))
);

// Переводит числовое значение активности в уровень 0-4 (для выбора цвета).
const getLevel = (value: number): number => {
	if (!value) return 0;

	if (value <= LEVEL_THRESHOLDS[0]) return 1;
	if (value <= LEVEL_THRESHOLDS[1]) return 2;
	if (value <= LEVEL_THRESHOLDS[2]) return 3;

	return 4;
};

/**
 * Календарь года зависит только от года, поэтому строится отдельно от данных активности:
 * даты и подписи форматируются один раз, а не при каждой загрузке активностей.
 * null-паддинг в начале нужен, чтобы 1 января встало в правильный день недели.
 * Недостающие ячейки в конце последней недели добираются в `rows` через `?? null`.
 *
 * month сохраняем сразу при переборе - БЕЗ повторного new Date(dateString),
 * который снова словил бы сдвиг из-за парсинга строки как UTC.
 */
const calendarDays = computed(() => {
	const start = new Date(Date.UTC(year.value, 0, 1));
	const end = new Date(Date.UTC(year.value, 11, 31));
	const mondayIndex = (start.getUTCDay() + 6) % 7;

	const days: ({ date: string; formatDate: string; month: number } | null)[] = Array.from(
		{ length: mondayIndex },
		() => null
	);
	const currentDate = new Date(start);

	while (currentDate <= end) {
		days.push({
			date: currentDate.toISOString().slice(0, 10),
			formatDate: formatLocalDate(currentDate),
			month: currentDate.getUTCMonth(),
		});

		currentDate.setUTCDate(currentDate.getUTCDate() + 1);
	}

	return days;
});

// Накладываем значения активности на готовый календарь.
const allDaysWithPadding = computed<(ActivityItemCell | null)[]>(() =>
	calendarDays.value.map((day) => {
		if (!day) return null;

		const value = activitiesMap.value.get(day.date) ?? 0;

		return { ...day, value, level: getLevel(value) };
	})
);

// Режем плоский список дней на недели по 7 штук - это и есть столбцы таблицы
const weeks = computed<(ActivityItemCell | null)[][]>(() => {
	const days = allDaysWithPadding.value;
	const result: (ActivityItemCell | null)[][] = [];

	for (let i = 0; i < days.length; i += 7) {
		result.push(days.slice(i, i + 7));
	}

	return result;
});

// Те же данные по строкам таблицы: строка = день недели, столбец = неделя.
const rows = computed(() => WEEKDAY_LABELS.map((_, row) => weeks.value.map((week) => week[row] ?? null)));

// Подписи месяцев: новая подпись начинается, когда у первого дня недели меняется месяц,
// colSpan - число недель до следующей подписи (для последней - до конца сетки).
const monthLabels = computed(() => {
	const starts: { month: number; colStart: number }[] = [];

	weeks.value.forEach((week, colStart) => {
		const month = week.find(Boolean)?.month;

		if (month !== undefined && month !== starts.at(-1)?.month) starts.push({ month, colStart });
	});

	return starts.map(({ month, colStart }, i) => ({
		name: String(MONTHS_LIST[month]),
		colStart,
		colSpan: (starts[i + 1]?.colStart ?? weeks.value.length) - colStart,
	}));
});

// После гидрации уточняем до локального дня пользователя (sv-SE даёт формат YYYY-MM-DD).
onMounted(() => {
	today.value = formatLocalDate(new Date(), "sv-SE");
});
</script>
