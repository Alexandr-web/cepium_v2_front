import type { EChartsOption } from "echarts";
import { useTradeStore } from "@/store/useTradeStore";

// Максимальное количество категорий, видимых одновременно
const CHART_VISIBLE_POINTS = 3;
// Высота полосы прокрутки
const CHART_SCROLLBAR_HEIGHT = 10;
// Максимальное количество отображаемых тикеров до группировки в категорию "Другие"
const MAX_TOP_SLICES = 5;

/**
 * Горизонтальный скролл для категориальных графиков (ECharts).
 * Окно фиксированной ширины (`visible` категорий) плавно панорамируется
 * свайпом/колесом или перетаскиванием полосы прокрутки.
 *
 * @param _total - Общее количество категорий
 * @param visible - Сколько категорий показывать одновременно
 */
const getChartScrollOptions = (_total: MaybeRefOrGetter<number>, visible = CHART_VISIBLE_POINTS) => {
	const total = computed(() => toValue(_total));
	const hasScroll = computed(() => total.value > visible);

	// Ширина окна в процентах: ровно `visible` категорий из N
	const windowSpan = computed(() => (hasScroll.value ? (visible / total.value) * 100 : 100));

	const zoomBase = computed(() => ({
		xAxisIndex: 0,
		start: 100 - windowSpan.value,
		end: 100,
		minSpan: windowSpan.value,
		maxSpan: windowSpan.value,
		zoomLock: true,
		filterMode: "none" as const,
		throttle: 0,
	}));

	const dataZoom = computed<EChartsOption["dataZoom"]>(() => [
		{
			...zoomBase.value,
			type: "inside",
			zoomOnMouseWheel: false,
			moveOnMouseWheel: true,
			moveOnMouseMove: true,
			preventDefaultMouseMove: false,
		},
		{
			...zoomBase.value,
			type: "slider",
			show: hasScroll.value,
			height: CHART_SCROLLBAR_HEIGHT,
			bottom: 4,
			left: "3%",
			right: "3%",
			brushSelect: false,
			showDataShadow: false,
			showDetail: false,
			handleSize: 0,
			moveHandleSize: 0,
			borderColor: CHART_COLORS.dataZoom.borderColor,
			backgroundColor: CHART_COLORS.dataZoom.backgroundColor,
			fillerColor: CHART_COLORS.dataZoom.fillerColor,
			borderRadius: CHART_SCROLLBAR_HEIGHT / 2,
			selectedDataBackground: {
				lineStyle: { opacity: 0 },
				areaStyle: { opacity: 0 },
			},
		},
	]);

	// Нижний отступ сетки с учётом полосы прокрутки (десктоп)
	const gridBottom = computed(() => (hasScroll.value ? CHART_SCROLLBAR_HEIGHT + 28 : "3%"));
	// Нижний отступ сетки с учётом полосы прокрутки (мобильные)
	const gridBottomMobile = computed(() => (hasScroll.value ? CHART_SCROLLBAR_HEIGHT + 35 : 20));

	return { hasScroll, dataZoom, gridBottom, gridBottomMobile };
};

/**
 * Композабл для формирования конфигурации кольцевой диаграммы (ECharts)
 * и данных легенды по распределению маржи между открытыми позициями.
 *
 * Агрегирует маржу по тикерам (суммируя long и short), выделяет топ-5 позиций,
 * а остальные объединяет в сегмент "Другие".
 *
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с реактивными опциями графика и списком элементов для легенды
 */
export const useMarginChart = (_options: MaybeRefOrGetter = {}) => {
	const tradeStore = useTradeStore();

	const trades = computed(() => tradeStore.getAllTrades());
	const opts = computed(() => toValue(_options));

	const marginsMap = computed(() =>
		trades.value.reduce<Map<string, number>>((map, t) => {
			if (!Number.isFinite(t.margin) || t.margin <= 0) return map;
	
			// суммируем, т.к. по одному символу может быть несколько позиций (long + short)
			map.set(t.symbol, (map.get(t.symbol) ?? 0) + t.margin);

			return map;
		}, new Map())
	);

	const sorted = computed(() => Array.from(marginsMap.value.entries()).sort((a, b) => b[1] - a[1]));
	const top = computed(() => {
		const slices = sorted.value.slice(0, MAX_TOP_SLICES);
		const restSum = slices.slice(MAX_TOP_SLICES).reduce((sum, [_, v]) => sum + v, 0);
		
		if (restSum > 0) slices.push(["Другие", restSum]);
		
		return slices;
	});

	const seriesData = computed(() =>
		top.value.map(([name, value]) => ({
			name: extractBaseSymbol(name),
			value,
		}))
	);

	const totalSum = computed(() =>
		trades.value.reduce((sum, trade) => sum + trade.margin, 0)
	);

	const options = computed<EChartsOption>(() => ({
		color: CHART_COLORS.color.positions,
		// сумма в центре кольца
		title: {
			text: formatNum(totalSum.value, { currency: "USD", style: "currency" }),
			subtext: "Всего",
			left: "center",
			top: "middle",
			itemGap: 4,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color, fontSize: 20, fontWeight: 600 },
			subtextStyle: { color: CHART_COLORS.legend.textStyle.color, fontSize: 12 },
		},
		tooltip: {
			trigger: "item",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			formatter: (params) => {
				const item = Array.isArray(params) ? params[0] : params;
				const value = formatNum(Number(item?.value), { currency: "USD", style: "currency" });
				const percent = formatNum(Number(item?.percent) / 100, { style: "percent" });
				return `${item?.name}: <span class="font-semibold">${value} (${percent})</span>`;
			},
		},
		series: [{
			type: "pie",
			radius: ["65%", "90%"],
			center: ["50%", "50%"],
			avoidLabelOverlap: true,
			label: { show: false },
			labelLine: { show: false },
			itemStyle: {
				borderWidth: 0,
			},
			emphasis: {
				scale: true,
				scaleSize: 6,
				itemStyle: {
					shadowBlur: 15,
					shadowColor: CHART_COLORS.series.pie.emphasis.itemStyle.shadowColor,
				},
			},
			data: seriesData.value,
		}],
		...opts.value,
	}));

	const legend = computed(() =>
		seriesData.value.map((item, idx) => ({
			name: String(item.name),
			percent: formatNum(totalSum.value ? item.value / totalSum.value : 0, { style: "percent" }),
			color: CHART_COLORS.color.positions[idx] ?? "",
		}))
	);

	return { options, legend };
};

/**
 * Композабл для формирования конфигурации столбчатой диаграммы (ECharts)
 * по распределению количества сделок (ордеров) по торговым инструментам.
 *
 * Включает адаптивное правило (`media`): на экранах шириной до 768px скрывает
 * ось Y и убирает боковые отступы сетки.
 *
 * @param _data - Реактивный или статический массив статистики сделок по активам
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с флагом отсутствия данных (`isEmpty`) и реактивными опциями графика (`options`)
 */
export const useOrdersBySymbolChart = (_data: MaybeRefOrGetter<StatisticsChartsResponse["data"]["trades_by_asset"] | undefined>, _options: MaybeRefOrGetter = {}) => {
	const opts = computed(() => toValue(_options));
	const data = computed(() => (toValue(_data) ?? []).map((item) => ({
		name: item.asset,
		value: item.count,
	})));

	const xAxisData = computed(() => data.value.map((item) => item.name));
	const seriesData = computed(() => data.value.map((item) => item.value).reverse());

	const isEmpty = computed(() => !data.value.length);

	const { dataZoom, gridBottom, gridBottomMobile } = getChartScrollOptions(() => data.value.length);

	const options = computed<EChartsOption>(() => ({
		tooltip: {
			trigger: "axis",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
		},
		grid: {
			top: "15%",
			left: "3%",
			right: "3%",
			bottom: gridBottom.value,
			containLabel: true,
		},
		xAxis: {
			type: "category",
			data: xAxisData.value,
			axisLine: {
				lineStyle: { color: CHART_COLORS.xAxis.axisLine.lineStyle.color },
			},
			axisTick: { show: false },
			axisLabel: {
				color: CHART_COLORS.xAxis.axisLabel.color,
				margin: 12,
				fontSize: 11,
			},
		},
		yAxis: {
			type: "value",
			axisLine: {
				lineStyle: { color: CHART_COLORS.yAxis.axisLine.lineStyle.color },
			},
			splitLine: {
				lineStyle: { color: CHART_COLORS.yAxis.splitLine.lineStyle.color, width: 1 },
			},
		},
		series: [{
			type: "bar",
			barWidth: "40%",
			label: {
				show: true,
				position: "top",
				distance: 8,
				color: CHART_COLORS.series.bar.label.color,
				fontSize: 12,
			},
			itemStyle: {
				color: CHART_COLORS.series.bar.itemStyle.color,
				borderColor: CHART_COLORS.series.bar.itemStyle.borderColor,
				borderRadius: [6, 6, 0, 0],
			},
			data: seriesData.value,
		}],
		media: [
			{
				query: {
					maxWidth: 768,
				},
				option: {
					yAxis: {
						show: false,
					},
					grid: {
						top: 30,
						bottom: gridBottomMobile.value,
						left: 0,
						right: 0,
						containLabel: false,
					},
					dataZoom: [
						{},
						{ left: 0, right: 0 },
					],
				},
			},
		],
		dataZoom: dataZoom.value,
		animationDurationUpdate: 300,
		animationEasingUpdate: "cubicOut",
		...opts.value,
	}));

	return { isEmpty, options };
};

/**
 * Композабл для формирования конфигурации кольцевой диаграммы (ECharts)
 * по соотношению прибыльных и убыточных сделок (win/loss ratio).
 *
 * Использует вертикальные линейные градиенты из палитры `CHART_COLORS.color.pie`
 * и выводит встроенную легенду в нижней части графика.
 *
 * @param _data - Реактивный или статический объект статистики `win_loss_ratio`
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с флагом отсутствия данных (`isEmpty`) и реактивными опциями графика (`options`)
 */
export const useOrdersWinLossChart = (_data: MaybeRefOrGetter<StatisticsChartsResponse["data"]["win_loss_ratio"] | undefined>, _options: MaybeRefOrGetter = {}) => {
	const opts = computed(() => toValue(_options));
	const data = computed(() => {
		const ratio = toValue(_data);
		return [
			{ name: "Прибыльные", value: Number(ratio?.profitable_count ?? 0) },
			{ name: "Убыточные", value: Number(ratio?.loss_count ?? 0) },
		];
	});

	const isEmpty = computed(() => !data.value.some((item) => isNumber(item.value) && item.value > 0));
	const options = computed<EChartsOption>(() => ({
		grid: {
			top: 30,
			bottom: 20,
			left: 40,
			right: 20,
			containLabel: true,
		},
		color: [
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: CHART_COLORS.color.pie[0]?.colorStops[0] ?? "transparent" },
					{ offset: 1, color: CHART_COLORS.color.pie[0]?.colorStops[1] ?? "transparent" },
				],
			},
			{
				type: "linear",
				x: 0, y: 0, x2: 0, y2: 1,
				colorStops: [
					{ offset: 0, color: CHART_COLORS.color.pie[1]?.colorStops[0] ?? "transparent" },
					{ offset: 1, color: CHART_COLORS.color.pie[1]?.colorStops[1] ?? "transparent" },
				],
			},
		],
		tooltip: {
			trigger: "item",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			formatter: (params) => {
				const item = Array.isArray(params) ? params[0] : params;
				const value = formatNum(Number(item?.value), { padZero: true });
				const percent = formatNum(Number(item?.percent) / 100, { style: "percent" });
				return `${item?.name}: <span class="font-semibold">${value} шт. (${percent})</span>`;
			},
		},
		legend: {
			show: true,
			bottom: 0,
			icon: "circle",
			itemWidth: 10,
			itemGap: 20,
			textStyle: {
				color: CHART_COLORS.legend.textStyle.color,
				fontSize: 13,
			},
		},
		series: [{
			type: "pie",
			radius: ["60%", "78%"],
			center: ["50%", "45%"],
			avoidLabelOverlap: true,
			label: { show: false },
			labelLine: { show: false },
			itemStyle: {
				borderWidth: 0,
			},
			emphasis: {
				scale: true,
				scaleSize: 6,
				itemStyle: {
					shadowBlur: 15,
					shadowColor: CHART_COLORS.series.pie.emphasis.itemStyle.shadowColor,
				},
			},
			data: data.value,
		}],
		...opts.value,
	}));

	return { isEmpty, options };
};

/**
 * Композабл для формирования конфигурации линейного графика (ECharts)
 * динамики прибыли/убытка (PnL в USD) по дням.
 *
 * Включает сглаженную кривую с градиентной заливкой области, подписи значений
 * над точками, форматирование валюты со знаком (`+` / `-`) и адаптивное правило
 * для мобильных экранов (до 768px скрывает ось Y и боковые отступы сетки).
 *
 * @param _data - Реактивный или статический массив ежедневной динамики прибыли `profit_dynamics`
 * @param _options - Реактивные или статические переопределения конфигурации `EChartsOption`
 * @returns Объект с флагом отсутствия данных (`isEmpty`) и реактивными опциями графика (`options`)
 */
export const useProfitByDayChart = (_data: MaybeRefOrGetter<StatisticsChartsResponse["data"]["profit_dynamics"] | undefined>, _options: MaybeRefOrGetter = {}) => {
	const opts = computed(() => toValue(_options));
	const data = computed(() => (toValue(_data) ?? []).map((item) => ({
		name: item.date,
		value: item.profit_usd,
	})));

	const xAxisData = computed(() => data.value.map((item) => formatLocalDate(String(item.name))));
	const seriesData = computed(() => data.value.map((item) => item.value));

	const isEmpty = computed(() => !data.value.length);

	const { dataZoom, gridBottom, gridBottomMobile } = getChartScrollOptions(() => data.value.length);

	const options = computed<EChartsOption>(() => ({
		tooltip: {
			trigger: "axis",
			backgroundColor: CHART_COLORS.tooltip.backgroundColor,
			borderColor: CHART_COLORS.tooltip.borderColor,
			borderWidth: 1,
			textStyle: { color: CHART_COLORS.tooltip.textStyle.color },
			formatter: (params) => {
				const item = Array.isArray(params) ? params[0] : params;
				const n = Number(item?.value);
				const currency = formatNum(n, { currency: "USD", style: "currency" });
				const formatCurrency = formatNumberSign(n, currency);
				const className = n > 0 ? "text-tertiary-700" : (n < 0 ? "text-secondary-500" : "");
				return `${item?.name}: <span class="font-medium ${className}">${formatCurrency}</span>`;
			},
		},
		grid: {
			top: "15%",
			left: "3%",
			right: "3%",
			bottom: gridBottom.value,
			containLabel: true,
		},
		xAxis: {
			type: "category",
			data: xAxisData.value,
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: {
				color: CHART_COLORS.xAxis.axisLabel.color,
				margin: 12,
				fontSize: 11,
			},
		},
		yAxis: {
			type: "value",
			axisLine: {
				onZero: true,
				lineStyle: { color: CHART_COLORS.yAxis.axisLine.lineStyle.color },
			},
			splitLine: {
				lineStyle: { color: CHART_COLORS.yAxis.splitLine.lineStyle.color, width: 1 },
			},
			axisLabel: {
				color: CHART_COLORS.yAxis.axisLabel.color,
				formatter: (value) => formatNum(Number(value), { currency: "USD", style: "currency" }),
				fontSize: 11,
			},
		},
		series: [{
			type: "line",
			smooth: true,
			symbol: "circle",
			symbolSize: 6,
			clip: true,
			label: {
				show: true,
				position: "top",
				distance: 8,
				color: CHART_COLORS.series.line.label.color,
				fontSize: 11,
				formatter: (params) => {
					const n = formatNum(Number(params.value), { currency: "USD", style: "currency" });
					return formatNumberSign(Number(params.value), n);
				},
			},
			itemStyle: { color: CHART_COLORS.series.line.itemStyle.color },
			lineStyle: {
				width: 3,
				color: CHART_COLORS.series.line.lineStyle.color,
				shadowBlur: 10,
				shadowColor: CHART_COLORS.series.line.lineStyle.shadowColor,
			},
			areaStyle: {
				color: {
					type: "linear",
					x: 0, y: 0, x2: 0, y2: 1,
					colorStops: [
						{ offset: 0, color: CHART_COLORS.series.line.areaStyle.color.colorStops[0] ?? "transparent" },
						{ offset: 1, color: CHART_COLORS.series.line.areaStyle.color.colorStops[1] ?? "transparent" },
					],
				},
			},
			data: seriesData.value,
		}],
		media: [
			{
				query: {
					maxWidth: 768,
				},
				option: {
					yAxis: {
						show: false,
					},
					grid: {
						top: 30,
						bottom: gridBottomMobile.value,
						left: 0,
						right: 0,
						containLabel: false,
					},
					dataZoom: [
						{},
						{ left: 0, right: 0 },
					],
				},
			},
		],
		animationDurationUpdate: 300,
		animationEasingUpdate: "cubicOut",
		dataZoom: dataZoom.value,
		...opts.value,
	}));

	return { isEmpty, options };
};
