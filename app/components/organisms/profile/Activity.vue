<template>
	<div class="flex flex-col lg:flex-row-reverse gap-6 w-full">
		<div class="flex items-center lg:self-end gap-6">
			<p class="text-neutral-700 text-12 lg:text-14">Меньше</p>
			<div class="flex items-center gap-3">
				<Tooltip
					v-for="(_, idx) in Object.keys(colorClasses)"
					:key="idx"
					:disabled="!isDesktop"
				>
					<template #trigger>
						<div
							class="w-10 lg:w-14 h-10 lg:h-14 rounded-3"
							:class="colorClasses[idx]"
						/>
					</template>
					<template #content>
						{{ legendRanges[idx] }}
					</template>
				</Tooltip>
			</div>
			<p class="text-neutral-700 text-12 lg:text-14">Больше</p>
		</div>
		<div class="w-full overflow-x-auto lg:max-w-1200 lg:mx-auto">
			<table class="w-max border-separate border-spacing-2">
				<thead>
					<tr>
						<td />
						<td
							v-for="label in monthLabels"
							:key="label.colStart"
							:colspan="label.colSpan"
							class="text-12 lg:text-14 text-neutral-600 pl-1"
						>
							{{ label.name }}
						</td>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(dayName, row) in WEEKDAY_LABELS" :key="dayName">
						<td class="text-12 lg:text-14 text-neutral-600 pr-2">{{ dayName }}</td>
						<td v-for="(week, col) in weeks" :key="col">
							<Tooltip v-if="week[row]" :disabled="!isDesktop">
								<template #trigger>
									<div class="w-12 lg:w-16 h-12 lg:h-16 rounded-2" :class="colorClasses[week[row]!.level]" />
								</template>
								<template #content>
									<div class="flex flex-col">
										<p>{{ week[row]?.date }}</p>
										<span v-if="week[row]?.value" class="font-bold text-primary-600">{{ week[row]?.value }}</span>
									</div>
								</template>
							</Tooltip>
							<div v-else class="w-12 lg:w-16 h-12 lg:h-16" />
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
		activities?: ActivityItem[]
		year?: number;
	}>(),
	{
		activities: () => [],
		year: () => new Date().getFullYear(),
	}
);

const { isDesktop } = useDevice();

// Фиксированные границы уровней активности.
const LEVEL_THRESHOLDS = [5, 10, 15, 20] as const;

const colorClasses = [
	"bg-primary-100",
	"bg-primary-300",
	"bg-primary-500",
	"bg-primary-700",
	"bg-primary-950",
];

const activitiesMap = computed(() => new Map<string, number>(props.activities.map((i) => [i.date, i.value])));

const legendRanges = computed(() => [
	"0",
	`1-${LEVEL_THRESHOLDS[0]}`,
	`${LEVEL_THRESHOLDS[0] + 1}-${LEVEL_THRESHOLDS[1]}`,
	`${LEVEL_THRESHOLDS[1] + 1}-${LEVEL_THRESHOLDS[2]}`,
	`${LEVEL_THRESHOLDS[2] + 1}+`,
]);

// Переводит числовое значение активности в уровень 0-4 (для выбора цвета).
const getLevel = (value: number): number => {
	if (!value) return 0;

	if (value <= LEVEL_THRESHOLDS[0]) return 1;
	if (value <= LEVEL_THRESHOLDS[1]) return 2;
	if (value <= LEVEL_THRESHOLDS[2]) return 3;

	return 4;
};

/**
 * Строим плоский список ячеек на весь год + null-паддинг по краям:
 * - в начале - чтобы 1 января встало в правильный день недели (под ПН/ВТ/...);
 * - в конце - чтобы последняя неделя дополнилась до полных 7 дней.
 *
 * month сохраняем сразу при переборе цикла - БЕЗ повторного new Date(dateString)
 * где-то дальше, который снова словил бы сдвиг из-за парсинга строки как UTC.
 */
const allDaysWithPadding = computed<(ActivityItemCell | null)[]>(() => {
	const start = new Date(props.year, 0, 1); // 1 января выбранного года
	const end = new Date(props.year, 11, 31); // 31 декабря выбранного года

	const mondayIndex = (start.getDay() + 6) % 7;

	const days: (ActivityItemCell | null)[] = [];

	// Паддинг в начале сетки: если год начинается не с понедельника,
	// заполняем пустыми ячейками (null) все дни ДО 1 января в первой неделе.
	// Это сдвигает 1 января в нужную строку (ПН/ВТ/СР/...) визуально в таблице.
	for (let i = 0; i < mondayIndex; i++) {
		days.push(null);
	}

	// стартует с 1 января и шагает по одному дню
	// до конца года включительно.
	const currentDate = new Date(start);

	while (currentDate <= end) {
		const dateStr = formatIsoToPrettyStr(currentDate.toISOString(), { type: "dmy" });
		const value = activitiesMap.value.get(dateStr) ?? 0;

		days.push({
			date: dateStr,
			value,
			level: getLevel(value),
			month: currentDate.getMonth(),
		});

		// двигаем дату на следующий день
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return days;
});

// Режем плоский список дней на недели по 7 штук - это и есть столбцы таблицы
const weeks = computed<(ActivityItemCell | null)[][]>(() => {
	const days = allDaysWithPadding.value;
	const result: (ActivityItemCell | null)[][] = [];

	for (let i = 0; i < days.length; i += 7) {
		result.push(days.slice(i, i + 7));
	}

	return result;
});

/**
 * Подписи месяцев над таблицей.
 * Идём по неделям, у каждой недели смотрим на первый НЕПУСТОЙ день (не null)
 * и берём его .month — уже готовое число, без повторного парсинга даты.
 * Как только месяц меняется — начинается новая подпись, а colspan досчитывается
 * потом как "сколько недель прошло до следующей смены месяца".
 */
const monthLabels = computed(() => {
	const labels: { name: string; colStart: number; colSpan: number }[] = [];
	let lastMonth = -1;

	weeks.value.forEach((week, weekIndex) => {
		const firstDay = week.find((d) => d !== null);
		if (!firstDay) return;

		// Если месяц этого дня отличается от последнего добавленного лейбла -
		// значит, началась новая колонка месяца, добавляем новую подпись
		if (firstDay.month !== lastMonth) {
			labels.push({
				name: String(MONTHS_LIST[firstDay.month]),
				colStart: weekIndex,
				colSpan: 0,
			});

			lastMonth = firstDay.month;
		}
	});

	// для каждой подписи вычисляем, сколько недель она должна накрыть (colspan).
	// Это разница между стартом текущей подписи и стартом следующей.
	// Для последней подписи - берём до самого конца сетки недель.
	labels.forEach((label, i) => {
		const next = labels[i + 1];
		label.colSpan = (next ? next.colStart : weeks.value.length) - label.colStart;
	});

	return labels;
});
</script>
