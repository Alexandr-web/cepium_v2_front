<template>
	<div class="overflow-x-auto w-full lg:max-w-1200 lg:mx-auto">
		<table class="w-max border-separate border-spacing-2">
			<thead>
				<tr>
					<td />
					<td
						v-for="label in monthLabels"
						:key="label.colStart"
						:colspan="label.colSpan"
						class="text-12 lg:text-14 text-neutral-500 pl-1"
					>
						{{ label.name }}
					</td>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(dayName, row) in WEEKDAY_LABELS" :key="dayName">
					<td class="text-12 lg:text-14 text-neutral-500 pr-2">{{ dayName }}</td>
					<td v-for="(week, col) in weeks" :key="col">
						<div
							v-if="week[row]"
							:class="['w-12 lg:w-16 h-12 lg:h-16 rounded-2', colorClasses[week[row]!.level]]"
						/>
						<div v-else class="w-12 lg:w-16 h-12 lg:h-16" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script setup lang="ts">
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

const colorClasses = [
	"bg-primary-100",
	"bg-primary-950",
	"bg-primary-700",
	"bg-primary-500",
	"bg-primary-300",
];

const activitiesMap = computed(() => new Map<string, number>(props.activities.map((i) => [i.date, i.value])));
const maxValue = computed(() => props.activities.reduce((max, item) => Math.max(max, item.value), 0));

/**
 * Переводит числовое значение активности в уровень 0-4 (для выбора цвета).
 * Уровень относительный: делит диапазон [0, max] на 4 части.
 */
const getLevel = (value: number): number => {
	if (!value) return 0;

	const ratio = value / (maxValue.value || 1);

	if (ratio > 0.75) return 4;
	if (ratio > 0.5) return 3;
	if (ratio > 0.25) return 2;

	return 1;
};

const formatDateLocal = (d: Date): string => {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
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

	// "бегущая" дата, стартует с 1 января и шагает по одному дню
	// до конца года включительно (currentDate <= end).
	const currentDate = new Date(start);

	while (currentDate <= end) {
		const dateStr = formatDateLocal(currentDate);
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
